using System.Net.Http;
using ThaoPham.Core.Services.Abstract;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using EPiServer.Logging.Compatibility;
using System.Collections.Generic;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Requests
{
    class MemberProfilesRequest : LifestyleRequestBase<LifestyleMemberProfilesData>
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(MemberProfilesRequest));

        public MemberProfilesRequest(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {

        }

        protected override ILog Log { get { return log; } }

        protected override string Endpoint { get { return LifestyleConstants.GetListMemberProfiles; } }
        public IEnumerable<KeyValuePair<string, string>> PostData { get; set; }
        protected override HttpMethod HttpRequestMethod { get { return HttpMethod.Post; } }
        protected override IEnumerable<KeyValuePair<string, string>> RequestContent { get { return PostData; } }
        protected override LifestyleResult<LifestyleMemberProfilesData> ProcessError(HttpResponseMessage response)
        {
            return new LifestyleResult<LifestyleMemberProfilesData>(response.StatusCode + "", response.Content.ReadAsStringAsync().Result);
        }
    }
}
