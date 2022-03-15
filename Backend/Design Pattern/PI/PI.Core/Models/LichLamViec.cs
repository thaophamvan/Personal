using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI.Core.Models
{
    [Table("TLichLamViec")]
    public partial class LichLamViec
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Ma { get; set; }
        public string NguoiTruc { get; set; }
        public int DonViTrucId { get; set; }
        public string MoTaTrucCaNgay { get; set; }
        public string MoTaTrucBuoiSang { get; set; }
        public string MoTaTrucBuoiChieu { get; set; }

        public string GioTrucSang { get; set; }
        public string GioTrucChieu { get; set; }
        public string GioTrucCaNgay { get; set; }
        public bool TrucCaNgay { get; set; }
        public DateTime NgayTruc { get; set; }
        public string NguoiNhapMay { get; set; }
        public DateTime NgayNhapMay { get; set; }

        [ForeignKey("DonViTrucId")]
        public virtual DonViTruc DonViTruc { get; set; }
    }
}
