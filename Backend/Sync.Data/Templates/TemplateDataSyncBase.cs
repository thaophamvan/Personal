using ThaoPham.Core.Helpers;
using ThaoPham.Web.Business.Iterable.Models;
using ThaoPham.Web.Business.Iterable.Services;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Services;
using EPiServer.ServiceLocation;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Templates
{
    public abstract class TemplateDataSyncBase
    {
        protected LifestyleSharedEmailsData _sharedEmails;
        protected static readonly IIterableUserService iterableService = ServiceLocator.Current.GetInstance<IIterableUserService>();
        protected static readonly ILifestyleMemberProfilesService lifestyleService = ServiceLocator.Current.GetInstance<ILifestyleMemberProfilesService>();
        public string TemplateMethodSyncToIterable(Func<bool> canDo, Action<string, string> save, LifestyleConfig config)
        {
            //this.BaseOperation();
            this.GetAllSharedEmail();
            return this.PerformSync(canDo, save, config);
        }
        // These operations already have implementations.
        protected LifestyleSharedEmailsData GetAllSharedEmail()
        {
            if (_sharedEmails == null)
                _sharedEmails = lifestyleService.GetAllSharedEmails().Result.ResultData;
            return _sharedEmails;
        }

        // These operations have to be implemented in subclasses.
        protected abstract string PerformSync(Func<bool> canDo, Action<string, string> save, LifestyleConfig config);

        public List<UserDataModel> ConvertToIterableUserDateModel(List<LifestyleMemberProfile> lifestyleUpdateMembers)
        {
            return lifestyleUpdateMembers.Select(t =>
            {
                return new UserDataModel
                {
                    Email = t.Email,
                    DataFields = ConvertToObject<Dictionary<string, object>>(t)
                };
            }).ToList();
        }
        public UpdateUsersResponse DoUpdate(List<LifestyleMemberProfile> lifestyleUpdateMembers)
        {
            var request = new UpdateUsersRequest
            {
                Users = ConvertToIterableUserDateModel(lifestyleUpdateMembers)
            };

            return AsyncHelper.RunSync(() => iterableService.UpdateUsers(request));
        }
        public Tobject ConvertToObject<Tobject>(object objectData)
        {
            var json = JsonConvert.SerializeObject(objectData);

            return JsonConvert.DeserializeObject<Tobject>(json);
        }
    }
}