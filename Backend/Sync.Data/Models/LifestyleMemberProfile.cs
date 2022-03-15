using System.Collections.Generic;
using Newtonsoft.Json;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Models
{
    public class LifestyleMemberProfile
    {
        [JsonProperty("externalMemberId")]
        public int ExternalMemberId { get; set; }
        [JsonProperty("email")]
        public string Email { get; set; }
        [JsonProperty("firstName")]
        public string FirstName { get; set; }
        [JsonProperty("lastName")]
        public string LastName { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("memberType")]
        public string MemberType { get; set; }
        [JsonProperty("phoneNumber")]
        public string PhoneNumber { get; set; }
        [JsonProperty("gender")]
        public string Gender { get; set; }
        [JsonProperty("age")]
        public string Age { get; set; }
        [JsonProperty("birthday")]
        public string Birthday { get; set; }
        [JsonProperty("job")]
        public string Job { get; set; }
        [JsonProperty("interestProducts")]
        public string InterestProducts { get; set; }
        [JsonProperty("zipcode")]
        public string Zipcode { get; set; }
        [JsonProperty("city")]
        public string City { get; set; }
        [JsonProperty("county")]
        public string County { get; set; }
        [JsonProperty("address1")]
        public string Address1 { get; set; }
        [JsonProperty("address2")]
        public string Address2 { get; set; }
        [JsonProperty("purchaseCount")]
        public int PurchaseCount { get; set; }
        [JsonProperty("purchaseValue")]
        public int PurchaseValue { get; set; }
        [JsonProperty("purchaseBigCount")]
        public int PurchaseBigCount { get; set; }
        [JsonProperty("purchaseBigValue")]
        public int PurchaseBigValue { get; set; }
        [JsonProperty("acceptMarketingEmail")]
        public bool AcceptMarketingEmail { get; set; }
        [JsonProperty("memberWarranties")]
        public List<LifestyleMemberWarranty> MemberWarranties { get; set; }
        [JsonProperty("memberWarrantyBigs")]
        public List<LifestyleMemberWarrantyBig> MemberWarrantyBigs { get; set; }
    }
}