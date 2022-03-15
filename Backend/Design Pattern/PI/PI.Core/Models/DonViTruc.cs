using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI.Core.Models
{
      [Table("TDonViTruc")]
    public partial class DonViTruc
    {
        public DonViTruc()
        {
            this.LichLamViec = new HashSet<LichLamViec>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Ma { get; set; }
        public string Ten { get; set; }
        public string MoTa { get; set; }
        public string NguoiNhapMay { get; set; }
        public DateTime? NgayNhapMay { get; set; }
        public virtual ICollection<LichLamViec> LichLamViec { get; set; }
    }
}
