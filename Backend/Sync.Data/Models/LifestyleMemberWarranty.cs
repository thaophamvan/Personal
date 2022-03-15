using Newtonsoft.Json;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Models
{
    public class LifestyleMemberWarranty
    {
        [JsonProperty("Id")]
        public int Id { get; set; }

        [JsonProperty("Member_Id")]
        public int MemberId { get; set; }

        [JsonProperty("Cust_Code")]
        public string CustCode { get; set; }

        [JsonProperty("Salutation")]
        public string Salutation { get; set; }

        [JsonProperty("First_Name")]
        public string FirstName { get; set; }

        [JsonProperty("Last_Name")]
        public string LastName { get; set; }

        [JsonProperty("Birth_Date")]
        public string BirthDate { get; set; }

        [JsonProperty("Addr1")]
        public string Addr1 { get; set; }

        [JsonProperty("Mobile_No")]
        public string MobileNo { get; set; }

        [JsonProperty("Email_Id")]
        public string EmailId { get; set; }

        [JsonProperty("Model")]
        public string Model { get; set; }

        [JsonProperty("Purc_Date")]
        public string PurcDate { get; set; }

        [JsonProperty("Mac_Sr_No")]
        public string MacSrNo { get; set; }

        [JsonProperty("Prod_Reg_Date")]
        public string ProdRegDate { get; set; }

        [JsonProperty("Mobile")]
        public string Mobile { get; set; }

        [JsonProperty("Member_Last_Name")]
        public string MemberLastName { get; set; }

        [JsonProperty("Member_First_Name")]
        public string MemberFirstName { get; set; }

        [JsonProperty("Product_Category")]
        public string ProductCategory { get; set; }

        [JsonProperty("Product_Price")]
        public string ProductPrice { get; set; }

        [JsonProperty("Product_Tag_Image")]
        public string ProductTagImage { get; set; }

        [JsonProperty("Product_Invoice_Image")]
        public string ProductInvoiceImage { get; set; }

        [JsonProperty("Purchase_Channel")]
        public string PurchaseChannel { get; set; }

        [JsonProperty("Created_At")]
        public int CreatedAt { get; set; }
        //[JsonProperty("Middle_Name")]
        //public string MiddleName { get; set; }
        //[JsonProperty("Race")]
        //public string Race { get; set; }
        //[JsonProperty("Occupation")]
        //public string Occupation { get; set; }
        //[JsonProperty("Cust_Type")]
        //public string CustType { get; set; }
        //[JsonProperty("Cust_Profile")]
        //public string Cust_Profile { get; set; }
        //[JsonProperty("Addr2")]
        //public string Addr2 { get; set; }
        //[JsonProperty("Addr3")]
        //public string Addr3 { get; set; }
        //[JsonProperty("Landmark")]
        //public string Landmark { get; set; }
        //[JsonProperty("Province")]
        //public string Province { get; set; }
        //[JsonProperty("District")]
        //public string District { get; set; }
        //[JsonProperty("Housing_Comp")]
        //public string HousingComp { get; set; }
        //[JsonProperty("City_Code")]
        //public string CityCode { get; set; }
        //[JsonProperty("State_Code")]
        //public string StateCode { get; set; }
        //[JsonProperty("Country_Code")]
        //public string CountryCode { get; set; }
        //[JsonProperty("Pin_Code")]
        //public string PinCode { get; set; }
        //[JsonProperty("Branch_Code")]
        //public string BranchCode { get; set; }
        //[JsonProperty("Res_Tel_No")]
        //public string ResTelNo { get; set; }
        //[JsonProperty("Off_Tel_No")]
        //public string OffTelNo { get; set; }
        //[JsonProperty("Off_Extn_No")]
        //public string OffExtnNo { get; set; }
        //[JsonProperty("Pager_No")]
        //public string PagerNo { get; set; }
        //[JsonProperty("Add_Contact_No")]
        //public string AddContactNo { get; set; }
        //[JsonProperty("Alt_Email_Id")]
        //public string AltEmailId { get; set; }
        //[JsonProperty("Reg_By")]
        //public string RegBy { get; set; }
        //[JsonProperty("Cust_Reg_Date")]
        //public string CustRegDate { get; set; }
        //[JsonProperty("Promo_Reqd")]
        //public string PromoReqd { get; set; }
        //[JsonProperty("Festival")]
        //public string Festival { get; set; }
        //[JsonProperty("First_Name_Local")]
        //public string FirstNameLocal { get; set; }
        //[JsonProperty("Last_Name_Local")]
        //public string LastNameLocal { get; set; }
        //[JsonProperty("House_Hold_Income")]
        //public string HouseHoldIncome { get; set; }
        //[JsonProperty("House_Hold_Size")]
        //public string HouseHoldSize { get; set; }
        //[JsonProperty("Info_Receive")]
        //public string InfoReceive { get; set; }
        //[JsonProperty("Preferred_Media")]
        //public string PreferredMedia { get; set; }
        //[JsonProperty("Is_Online")]
        //public string IsOnline { get; set; }
        //[JsonProperty("Reg_By_Ent_Code")]
        //public string RegByEntCode { get; set; }
        //[JsonProperty("Third_Party_Cust_Id")]
        //public string ThirdPartyCustId { get; set; }
        //[JsonProperty("Alt_Mobile_No")]
        //public string AltMobileNo { get; set; }
        //[JsonProperty("Excluded_From_Nps")]
        //public string ExcludedFromNps { get; set; }
        //[JsonProperty("Opt_In")]
        //public string OptIn { get; set; }
        //[JsonProperty("Source")]
        //public string Source { get; set; }
        //[JsonProperty("Prod_Type_Code")]
        //public string ProdTypeCode { get; set; }
        //[JsonProperty("Prod_Grp_Code")]
        //public string ProdGrpCode { get; set; }
        //[JsonProperty("Brand_Code")]
        //public string BrandCode { get; set; }
        //[JsonProperty("Capacity_Code")]
        //public string CapacityCode { get; set; }
        //[JsonProperty("Fg_Item_Code")]
        //public string FgItemCode { get; set; }
        //[JsonProperty("Alien_Model")]
        //public string AlienModel { get; set; }
        //[JsonProperty("Pnc_No")]
        //public string PncNo { get; set; }
        //[JsonProperty("Product_Invoice2_Image")]
        //public string ProductInvoice2Image { get; set; }
        //[JsonProperty("Puref9_Gift_201809")]
        //public string Puref9Gift201809 { get; set; }
        //[JsonProperty("Pureq9_Gift_201908")]
        //public string Pureq9Gift201908 { get; set; }
        //[JsonProperty("Purea9_Gift_201908")]
        //public string Purea9Gift201908 { get; set; }
        //[JsonProperty("A9_Maintenance_service")]
        //public string A9MaintenanceService { get; set; }
        //[JsonProperty("i9.2_Pre_Sale_Gift")]
        //public string i92PreSaleGift { get; set; }
        //[JsonProperty("Joined_Events")]
        //public string JoinedEvents { get; set; }
        //[JsonProperty("CouponCode")]
        //public string CouponCode { get; set; }
    }
}