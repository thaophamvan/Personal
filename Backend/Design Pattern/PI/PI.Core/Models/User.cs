using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PI.Core.Models
{
    [Table("TUser")]
    public partial class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Ma { get; set; }
        public string HoVaTen { get; set; }
        public string TenDangNhap { get; set; }
        public string MatKhau { get; set; }
        public string NguoiNhapMay { get; set; }
        public DateTime? NgayNhapMay { get; set; }
    }
}
