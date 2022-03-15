using Newtonsoft.Json;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Models
{
    public class LifestyleMemberWarrantyBig : LifestyleMemberWarranty
    {
        [JsonProperty("product_Pn_Sakura")]
        public string ProductPnSakura { get; set; }

        [JsonProperty("product_Tag_Sakura_Image")]
        public string ProductTagSakuraImage { get; set; }

        [JsonProperty("product_Setting_Date")]
        public string ProductSettingDate { get; set; }
    }
}