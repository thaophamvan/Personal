using System;
using System.Threading;
using EPiServer.PlugIn;
using Personal.ScheduledJobWithParameters;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Templates;
using System.Collections.Generic;
using System.Web.UI.WebControls;
using EPiServer.Data.Dynamic;
using Personal.ScheduledJobWithParameters.Extensions;
using System.Globalization;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using ThaoPham.Core.Extentions;
using ThaoPham.Data.Entities;
using ThaoPham.Data;
using EPiServer.ServiceLocation;
using System.Linq;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs
{
    [ScheduledPlugInWithParameters(
       DisplayName = "[Lifestyle] Sync All Lifestyle Data",
       GUID = "DE95434D-5134-4993-B278-829C0215952A",
       Description = "Sync all data from Lifestyle to iterable",
       SortIndex = 49,
        DefinitionsClass = "ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs.SyncAllLifestyleDataParamDefinition",
        DefinitionsAssembly = "ThaoPham.Web")]
    public class SyncAllLifestyleDataScheduledJob : ScheduledJobWithEventBase
    {
        private readonly IThaoPhamDataRepository _repository = ServiceLocator.Current.GetInstance<IThaoPhamDataRepository>();
        private readonly IUnitOfWork _unitOfWork = ServiceLocator.Current.GetInstance<IUnitOfWork>();
        private CommerceImportEventArgs _importArg;
        private static readonly object jobLock = new object();

        public SyncAllLifestyleDataScheduledJob()
        {
            IsStoppable = true;
        }

        /// <summary>
        /// Called when a user clicks on Stop for a manually started job, or when ASP.NET shuts down.
        /// </summary>
        public override void Stop()
        {
            _stopSignaled = true;
            base.Stop();

        }

        /// <summary>
        /// Called when a scheduled job executes
        /// </summary>
        /// <returns>A status message to be stored in the database log and visible from admin mode</returns>
        public override string Execute()
        {
            bool hasException = false;
            string summary = "";
            string errorMsg = "";

            if (Monitor.TryEnter(jobLock))
            {
                _stopSignaled = false;

                CommercerImportEvents.Instance.DetachEvent();
                CommercerImportEvents.Instance.RaiseImportStatusChanged += HandleImportStatusChanged;

                _importArg = CommerceImportEventArgs.CreateNew("Starting execution");
                CommercerImportEvents.Instance.OnImporStatusChanged(this, _importArg);

                Func<bool> stopFunc = () => { return !_stopSignaled; };
                // Save history
                var savePageNumber = _repository.FindBy<LifeStylesJobLoggingExternal>(l => l.DataKey == SyncAllLifestyleDataParamDefinition.FromPageNumber).FirstOrDefault();
                Action<string, string> save = (key, value) =>
                {
                    var loggingExternal = new LifeStylesJobLoggingExternal() { DataKey = key, DataValue = value, CreatedOn = DateTime.UtcNow };

                    if (savePageNumber != null)
                    {
                        savePageNumber.DataKey = key;
                        savePageNumber.DataValue = value;
                        savePageNumber.CreatedOn = DateTime.UtcNow;
                        _repository.AddOrUpdate(savePageNumber, v => v.DataKey == key);
                    }
                    else
                    {
                        _repository.Add(loggingExternal);
                    }

                    _unitOfWork.SetCurrentDbContext(_repository.GetCurrentDbContext());
                    _unitOfWork.Commit();
                };

                try
                {
                    _importArg = CommerceImportEventArgs.CreateNew("Pulling data");
                    CommercerImportEvents.Instance.OnImporStatusChanged(this, _importArg);
                    var syncAll = new TemplateDataSyncAll();
                    var config = GetSetting(savePageNumber);
                    summary = syncAll.TemplateMethodSyncToIterable(stopFunc, save, config);

                }
                catch (Exception ex)
                {
                    hasException = true;
                    _importArg =
                        CommerceImportEventArgs.CreateNew($"{this.GetType()}", isLog: true, ex);

                    errorMsg = GetStatusOfJob(_importArg);
                }
                finally
                {
                    Monitor.Exit(jobLock);
                }

                //For long running jobs periodically check if stop is signaled and if so stop execution
                if (_stopSignaled && !hasException)
                {
                    _importArg = CommerceImportEventArgs.CreateNew($"Job stopped by user. <br>{summary}");
                    return GetStatusOfJob(_importArg);
                }
            }
            else
            {
                throw new InvalidProgramException("Job is already running.");
            }

            if (!hasException)
            {
                _importArg = CommerceImportEventArgs.CreateNew($"Summary: <br> {summary}", isLog: true);
            }
            else
            {
                throw new InvalidProgramException($"Importing failed. {errorMsg} {summary}");
            }
            return GetStatusOfJob(_importArg);

        }
        private LifestyleConfig GetSetting(LifeStylesJobLoggingExternal data)
        {
            var config = new LifestyleConfig();
            var descriptor = PlugInDescriptor.Load("ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs.SyncAllLifestyleDataScheduledJob", "ThaoPham.Web");
            var store = typeof(ScheduledJobParameters).GetStore();
            var parameters = store.LoadPersistedValuesFor(descriptor.ID.ToString(CultureInfo.InvariantCulture));

            if (parameters[SyncAllLifestyleDataParamDefinition.FromPageNumber].IsNullOrEmpty() && data != null && !string.IsNullOrEmpty(data.DataValue))
            {
                config.FromPageNumer = Convert.ToInt32(data.DataValue);
            }
            else
            {
                config.FromPageNumer = Convert.ToInt32(!parameters[SyncAllLifestyleDataParamDefinition.FromPageNumber].IsNullOrEmpty() ? parameters[SyncAllLifestyleDataParamDefinition.FromPageNumber] : 1);
            }

            config.ToPageNumer = Convert.ToInt32(!parameters[SyncAllLifestyleDataParamDefinition.ToPageNumber].IsNullOrEmpty() ? parameters[SyncAllLifestyleDataParamDefinition.ToPageNumber] : 0);
            config.NumberItemPerPage = Convert.ToInt32(!parameters[SyncAllLifestyleDataParamDefinition.NumberItemPerPage].IsNullOrEmpty() ? parameters[SyncAllLifestyleDataParamDefinition.NumberItemPerPage] : 10);
            return config;
        }
    }
    public class SyncAllLifestyleDataParamDefinition : ScheduledJobParameterDefinition
    {
        public const string FromPageNumber = "FromPageNumber";
        public const string ToPageNumber = "ToPageNumber";
        public const string NumberItemPerPage = "NumberItemPerPage";
        public const string LifestylePageNumberFailed = "LifestylePageNumberFailed";

        public override IEnumerable<ParameterControlDTO> GetParameterControls()
        {
            return new List<ParameterControlDTO>
                {
                    AddFromPageNumber(),
                    AddToPageNumber(),
                    AddNumberItemPerPage()
                };
        }
        private ParameterControlDTO AddFromPageNumber()
        {
            return new ParameterControlDTO
            {
                LabelText = "From page number",
                Description = "Query from page number. Eg: 1",
                Control = new TextBox { ID = FromPageNumber }
            };
        }
        private ParameterControlDTO AddToPageNumber()
        {
            return new ParameterControlDTO
            {
                LabelText = "To page number",
                Description = "Query to page number. Eg: 1",
                Control = new TextBox { ID = ToPageNumber }
            };
        }
        private ParameterControlDTO AddNumberItemPerPage()
        {
            return new ParameterControlDTO
            {
                LabelText = "Number item per page",
                Description = "Number item per page. Eg: 10",
                Control = new TextBox { ID = NumberItemPerPage }
            };
        }
    }
}
