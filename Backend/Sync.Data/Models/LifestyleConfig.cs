namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Models
{
    public class LifestyleConfig
    {
        public int FromPageNumer { get; set; }
        public int ToPageNumer { get; set; }
        public int NumberItemPerPage { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string LastUpdate { get; set; }
    }
}