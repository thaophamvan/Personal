using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PI.Core.Models
{
    [Table("TChucVu")]
    public partial class ChucVu
    {
        public ChucVu()
        {
            this.TrucBan = new HashSet<TrucBan>();
        }
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Ma { get; set; }
        public string Ten { get; set; }
        public string MoTa { get; set; }
        public string NguoiNhapMay { get; set; }
        public DateTime? NgayNhapMay { get; set; }
        public virtual ICollection<TrucBan> TrucBan { get; set; }
    }
}
