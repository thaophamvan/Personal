using System.Collections.Generic;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Business.LifeStyles.Models;
using Newtonsoft.Json;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Models
{
    public class LifestyleMemberProfilesData : LifestyleResponseBase
    {
        [JsonProperty("TotalRecords")]
        public int TotalRecords { get; set; }
        [JsonProperty("Customers")]
        public IEnumerable<LifestyleMemberProfile> Customers { get; set; }
    }
}