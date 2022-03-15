using System;
using System.Threading;
using EPiServer.PlugIn;
using Personal.ScheduledJobWithParameters;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Templates;
using System.Collections.Generic;
using System.Web.UI.WebControls;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using EPiServer.Data.Dynamic;
using Personal.ScheduledJobWithParameters.Extensions;
using System.Globalization;
using System.Linq;
using ThaoPham.Data.Entities;
using ThaoPham.Data;
using EPiServer.ServiceLocation;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs
{
    [ScheduledPlugInWithParameters(
       DisplayName = "[Lifestyle] Sync new Lifestyle Data",
       GUID = "FB478942-0C07-4B82-8B6B-48ED7C2E5792",
       Description = "Sync new data from Lifestyle to iterable",
       SortIndex = 49,
        DefinitionsClass = "ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs.SyncNewLifestyleDataParamDefinition",
        DefinitionsAssembly = "ThaoPham.Web")]
    public class SyncNewLifestyleMemberProfilesScheduledJob : ScheduledJobWithEventBase
    {
        private CommerceImportEventArgs _importArg;
        private static readonly object jobLock = new object();
        private readonly IThaoPhamDataRepository _repository = ServiceLocator.Current.GetInstance<IThaoPhamDataRepository>();
        private readonly IUnitOfWork _unitOfWork = ServiceLocator.Current.GetInstance<IUnitOfWork>();

        public SyncNewLifestyleMemberProfilesScheduledJob()
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
                // Listen event place order import status changed
                CommercerImportEvents.Instance.DetachEvent();
                CommercerImportEvents.Instance.RaiseImportStatusChanged += HandleImportStatusChanged;

                _importArg = CommerceImportEventArgs.CreateNew("Starting execution");
                CommercerImportEvents.Instance.OnImporStatusChanged(this, _importArg);

                Func<bool> stopFunc = () => { return !_stopSignaled; };
                var lastSyncDate = _repository.FindBy<LifeStylesJobLoggingExternal>(l => l.DataKey == SyncNewLifestyleDataParamDefinition.LifestyleLastSyncDate).FirstOrDefault();
                Action<string, string> save = (key, value) =>
                {
                    var loggingExternal = new LifeStylesJobLoggingExternal() { DataKey = key, DataValue = value, CreatedOn = DateTime.UtcNow };
                    if (lastSyncDate != null)
                    {
                        lastSyncDate.DataKey = key;
                        lastSyncDate.DataValue = value;
                        lastSyncDate.CreatedOn = DateTime.UtcNow;
                        _repository.AddOrUpdate(lastSyncDate, v => v.DataKey == key);
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
                    var syncNew = new TemplateDataSyncNew();
                    var config = GetSetting(lastSyncDate);
                    summary = syncNew.TemplateMethodSyncToIterable(stopFunc, save, config);
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
                throw new InvalidProgramException($"Importing failed. {errorMsg} {summary}");
            }

            if (!hasException)
            {
                _importArg = CommerceImportEventArgs.CreateNew($"Summary: <br> {summary}", isLog: true);
            }
            else
            {
                throw new InvalidProgramException($"Importing failed. {errorMsg}");
            }
            return GetStatusOfJob(_importArg);

        }
        private LifestyleConfig GetSetting(LifeStylesJobLoggingExternal log)
        {
            var config = new LifestyleConfig();
            var descriptor = PlugInDescriptor.Load("ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs.SyncNewLifestyleMemberProfilesScheduledJob", "ThaoPham.Web");
            var store = typeof(ScheduledJobParameters).GetStore();
            var parameters = store.LoadPersistedValuesFor(descriptor.ID.ToString(CultureInfo.InvariantCulture));
            config.FromDate = parameters.ContainsKey(SyncNewLifestyleDataParamDefinition.LifestyleSyncDateFrom)
                ? parameters[SyncNewLifestyleDataParamDefinition.LifestyleSyncDateFrom] as string : "";
            config.ToDate = parameters.ContainsKey(SyncNewLifestyleDataParamDefinition.LifestyleSyncDateTo)
                ? parameters[SyncNewLifestyleDataParamDefinition.LifestyleSyncDateTo] as string : "";

            if (!string.IsNullOrEmpty(log?.DataValue))
            {
                config.LastUpdate = log.DataValue;
            }

            return config;
        }

    }
    public class SyncNewLifestyleDataParamDefinition : ScheduledJobParameterDefinition
    {
        public const string LifestyleSyncDateFrom = "LifestyleSyncDateFrom";
        public const string LifestyleSyncDateTo = "LifestyleSyncDateTo";
        public const string LifestyleLastSyncDate = "LifestyleLastSyncDate";
        public const string LifestyleSyncDateFailed = "LifestyleSyncDateFailed";
        private readonly IThaoPhamDataRepository _repository = ServiceLocator.Current.GetInstance<IThaoPhamDataRepository>();
        public override IEnumerable<ParameterControlDTO> GetParameterControls()
        {
            return new List<ParameterControlDTO>
                {
                    AddSyncDateFrom(),
                    AddSyncDateTo(),
                    AddLifestyleLastSyncDate()
                };
        }
        private ParameterControlDTO AddSyncDateFrom()
        {
            return new ParameterControlDTO
            {
                LabelText = "From date:yyyy-MM-dd HH:mm:ss",
                Description = "Query from date. Eg: 2021-10-05 23:59:59",
                Control = new TextBox { ID = LifestyleSyncDateFrom }
            };
        }
        private ParameterControlDTO AddLifestyleLastSyncDate()
        {
            return new ParameterControlDTO
            {
                LabelText = "Last sync date :yyyy-MM-dd HH:mm:ss",
                Description = "Query from last date. Eg: 2021-10-05 23:59:59",
                Control = new TextBox { ID = LifestyleLastSyncDate }
            };
        }
        private ParameterControlDTO AddSyncDateTo()
        {
            return new ParameterControlDTO
            {
                LabelText = "To date : yyyy-MM-dd HH:mm:ss",
                Description = "Query to date. Eg: 2021-10-05 23:59:59",
                Control = new TextBox { ID = LifestyleSyncDateTo }
            };
        }
        public override void SetValue(System.Web.UI.Control control, object value)
        {
            base.SetValue(control, value);

            if (control is TextBox)
            {
                if (control.ID.Equals(LifestyleLastSyncDate, StringComparison.InvariantCultureIgnoreCase))
                {
                    var lastSyncDate = _repository.FindBy<LifeStylesJobLoggingExternal>(l => l.DataKey == SyncNewLifestyleDataParamDefinition.LifestyleLastSyncDate).FirstOrDefault();
                    if (!string.IsNullOrEmpty(lastSyncDate?.DataValue))
                    {
                        ((TextBox)control).Text = lastSyncDate.DataValue;
                    }
                }
            }
        }
    }
}
