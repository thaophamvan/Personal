using System.Threading;
using System.Threading.Tasks;
using ThaoPham.Core.Helpers;
using ThaoPham.Core.Services.Abstract;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Requests;
using EPiServer.ServiceLocation;
using System.Collections.Generic;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Services
{
    
    [ServiceConfiguration(typeof(ILifestyleMemberProfilesService), Lifecycle = ServiceInstanceScope.Singleton)]
    public class LifestyleMemberProfilesService : ILifestyleMemberProfilesService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public LifestyleMemberProfilesService(IHttpClientFactory httpClientFactory)
        {
            Ensure.IsNotNull(httpClientFactory, nameof(httpClientFactory));
            _httpClientFactory = httpClientFactory;
        }
        public async Task<LifestyleResult<LifestyleMemberProfilesData>> GetListMemberProfiles(IEnumerable<KeyValuePair<string, string>> requestContent, CancellationToken cancellationToken)
        {
            var request = new MemberProfilesRequest(_httpClientFactory);
            request.PostData = requestContent;
            return await request.ProcessRequest(cancellationToken);
        }

        public async Task<LifestyleResult<LifestyleMemberProfilesData>> GetListMenberProfilesByDate(IEnumerable<KeyValuePair<string, string>> requestContent, CancellationToken cancellationToken)
        {
            var request = new MemberProfilesByDateRequest(_httpClientFactory);
            request.PostData = requestContent;
            return await request.ProcessRequest(cancellationToken);
        }
        public async Task<LifestyleResult<LifestyleSharedEmailsData>> GetAllSharedEmails(CancellationToken cancellationToken)
        {
            var request = new SharedEmailsRequest(_httpClientFactory);

            return await request.ProcessRequest(cancellationToken);
        }
    }
}