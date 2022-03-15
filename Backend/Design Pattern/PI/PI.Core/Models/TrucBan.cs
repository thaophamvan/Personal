using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI.Core.Models
{
    [Table("TDanhSachTrucBan")]
    public partial class TrucBan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Ma { get; set; }
        //public int ThuTu { get; set; }
        public string HoVaTen { get; set; }
        public int DonViId { get; set; }
        public int CapBacId { get; set; }
        public int ChucVuId { get; set; }
        public int HinhThucTrucId { get; set; }
        public DateTime ThoiGianTu { get; set; }
        public DateTime ThoiGianDen { get; set; }
        public int? KipTruc { get; set; }
        public string CaTruc { get; set; }
        public string NguoiNhapMay { get; set; }
        public DateTime NgayNhapMay { get; set; }

        [ForeignKey("DonViId")]        
        public virtual DonVi DonVi { get; set; }
        [ForeignKey("CapBacId")]
        public virtual CapBac CapBac { get; set; }
        [ForeignKey("ChucVuId")]
        public virtual ChucVu ChucVu { get; set; }
        [ForeignKey("HinhThucTrucId")]
        public virtual HinhThucTruc HinhThucTruc { get; set; }
        
    }
}
