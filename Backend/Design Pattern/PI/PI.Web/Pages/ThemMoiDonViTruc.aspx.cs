using System;
using PI.Core.Interface.Data;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Core.Models;
using PI.Data;
using PI.Data.Interface;
using PI.Data.UnitOfWork;
using PI.Services.Business;
using PI.Common.User;

namespace PI.Web.Pages
{
    public partial class ThemMoiDonViTruc : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        private readonly IDonViTrucService _donviService;
        public ThemMoiDonViTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonViTruc> repository = new Repository<DonViTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._donviService = new DonViTrucService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            var donvi = new DonViTruc
            {
                Ten = txtName.Text,
                MoTa = txtDescription.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _donviService.Add(donvi);

            Response.Redirect("DanhMucDonViTruc.aspx");
            
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucDonViTruc.aspx");
        }
    }
}