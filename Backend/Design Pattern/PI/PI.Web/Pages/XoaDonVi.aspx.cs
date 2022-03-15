using System;
using System.Globalization;
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
    public partial class XoaDonVi : System.Web.UI.Page
    {
        int _donviId = 0;
        private readonly IDonViService _donviService;

        public XoaDonVi()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonVi> repository = new Repository<DonVi>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._donviService = new DonViService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhMucDonVi.aspx");
            }

            try
            {
                _donviId = Convert.ToInt32(id);
                DonVi donvi = _donviService.GetById(_donviId);

                lblMa.Text = donvi.Ma.ToString(CultureInfo.InvariantCulture);
                txtTT.Text = donvi.TT.ToString();
                lblTrucTheoKip.Text = donvi.TrucTheoKip.ToString();
                lblTen.Text = donvi.Ten;
                lblMoTa.Text = donvi.MoTa;
                lblNguoINhapMay.Text = donvi.NguoiNhapMay;
                lblNgayNhapMay.Text = donvi.NgayNhapMay.ToString();
            }
            catch (Exception)
            {
                Response.Redirect("DanhMucDonVi.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucDonVi.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            DonVi donvi = _donviService.GetById(_donviId);
            _donviService.Delete(donvi);
            Response.Redirect("DanhMucDonVi.aspx");
           
        }
    }
}