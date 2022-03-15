using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI.Core.Models
{
      [Table("TDonVi")]
    public partial class DonVi
    {
        public DonVi()
        {
            
            this.DanhSacTrucBan = new HashSet<TrucBan>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Ma { get; set; }

        public int TT { get; set; }
        public string Ten { get; set; }
        public string MoTa { get; set; }
        public bool TrucTheoKip { get; set; }
        public string NguoiNhapMay { get; set; }
        public DateTime? NgayNhapMay { get; set; }
        public virtual ICollection<TrucBan> DanhSacTrucBan { get; set; }
    }
}
