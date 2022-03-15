using System;
using System.Web.UI;
using PI.Common.User;
using PI.Core.Interface.Data;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Core.Models;
using PI.Data;
using PI.Data.Interface;
using PI.Data.UnitOfWork;
using PI.Services.Business;

namespace PI.Web.Pages
{
    public partial class ThemMoiChucVu : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
          
        }
        private readonly IChucVuService _chucvuService;
        public ThemMoiChucVu()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<ChucVu> repository = new Repository<ChucVu>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new ChucVuService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            var chucvu = new ChucVu
            {
                Ten = txtName.Text,
                MoTa = txtDescription.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _chucvuService.Add(chucvu);

            Response.Redirect("DanhMucChucVu.aspx");
            
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucChucVu.aspx");
        }
    }
}