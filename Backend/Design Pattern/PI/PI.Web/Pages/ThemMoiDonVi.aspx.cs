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
    public partial class ThemMoiDonVi : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        private readonly IDonViService _donviService;
        public ThemMoiDonVi()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonVi> repository = new Repository<DonVi>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._donviService = new DonViService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            var donvi = new DonVi
            {
                TT = Convert.ToInt32(txtTT.Text),
                Ten = txtName.Text,
                MoTa = txtDescription.Text,
                TrucTheoKip = cbTrucTheoKip.Checked,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _donviService.Add(donvi);

            Response.Redirect("DanhMucDonVi.aspx");
            
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucDonVi.aspx");
        }
    }
}