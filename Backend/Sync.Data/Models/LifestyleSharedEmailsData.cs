using System.Collections.Generic;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Business.LifeStyles.Models;
using Newtonsoft.Json;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Models
{
    public class LifestyleSharedEmailsData : LifestyleResponseBase
    {
        [JsonProperty("Emails")]
        public IEnumerable<string> Emails { get; set; }
    }
}