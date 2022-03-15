using System;
using System.Globalization;
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
    public partial class SuaDonVi : System.Web.UI.Page
    {
        int _donviId = 0;
        private readonly IDonViService _chucvuService;

        public SuaDonVi()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonVi> repository = new Repository<DonVi>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new DonViService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhMucDonVi.aspx");
                }

                try
                {
                    _donviId = Convert.ToInt32(id);
                    DonVi donvi = _chucvuService.GetById(_donviId);
                    txtTT.Text = donvi.TT.ToString();
                    txtTen.Text = donvi.Ten;
                    txtMoTa.Text = donvi.MoTa;
                    cbTrucTheoKip.Checked = donvi.TrucTheoKip;
                }
                catch (Exception)
                {
                    Response.Redirect("DanhMucDonVi.aspx");
                }
            }
           
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucDonVi.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {

            string id = Request.QueryString["id"] as string;
            _donviId = Convert.ToInt32(id);
            var donvi = new DonVi
            {
                Ma = _donviId,
                TT = Convert.ToInt32(txtTT.Text),
                Ten = txtTen.Text,
                MoTa = txtMoTa.Text,
                TrucTheoKip = cbTrucTheoKip.Checked,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _chucvuService.Update(donvi);
            Response.Redirect("DanhMucDonVi.aspx");
           
        }
    }
}