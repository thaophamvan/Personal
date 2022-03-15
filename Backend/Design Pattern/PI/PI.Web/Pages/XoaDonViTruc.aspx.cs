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
    public partial class XoaDonViTruc : System.Web.UI.Page
    {
        int _donviId = 0;
        private readonly IDonViTrucService _donviService;

        public XoaDonViTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonViTruc> repository = new Repository<DonViTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._donviService = new DonViTrucService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhMucDonViTruc.aspx");
            }

            try
            {
                _donviId = Convert.ToInt32(id);
                DonViTruc donvi = _donviService.GetById(_donviId);

                lblMa.Text = donvi.Ma.ToString(CultureInfo.InvariantCulture);
                lblTen.Text = donvi.Ten;
                lblMoTa.Text = donvi.MoTa;
                lblNguoINhapMay.Text = donvi.NguoiNhapMay;
                lblNgayNhapMay.Text = donvi.NgayNhapMay.ToString();
            }
            catch (Exception)
            {
                Response.Redirect("DanhMucDonViTruc.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucDonViTruc.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            DonViTruc donvi = _donviService.GetById(_donviId);
            _donviService.Delete(donvi);
            Response.Redirect("DanhMucDonViTruc.aspx");
           
        }
    }
}