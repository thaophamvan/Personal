using System.Net.Http;
using ThaoPham.Core.Services.Abstract;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using EPiServer.Logging.Compatibility;
using System.Collections.Generic;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Requests
{
    class SharedEmailsRequest : LifestyleRequestBase<LifestyleSharedEmailsData>
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(LifestyleSharedEmailsData));

        public SharedEmailsRequest(IHttpClientFactory httpClientFactory) : base(httpClientFactory)
        {
            
        }

        protected override ILog Log { get { return log; } }

        protected override string Endpoint { get { return LifestyleConstants.GetAllSharedEmails; } }

        protected override HttpMethod HttpRequestMethod { get { return HttpMethod.Post; }  }

        protected override IEnumerable<KeyValuePair<string, string>> RequestContent { get { return null; }  }
 
        protected override LifestyleResult<LifestyleSharedEmailsData> ProcessError(HttpResponseMessage response)
        {
            return new LifestyleResult<LifestyleSharedEmailsData>(response.StatusCode + "", response.Content.ReadAsStringAsync().Result);
        }
    }
}
