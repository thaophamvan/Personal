using System;
using System.Linq;
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
    public partial class ThemMoiLichLamViec : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                LoadDropdownList();
            }
        }
        private readonly ILichLamViecService _lichlamviecService;
        private readonly IDonViTrucService _donviService;
        public ThemMoiLichLamViec()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonViTruc> repositoryDonVi = new Repository<DonViTruc>(databaseFactory);
            IRepository<LichLamViec> repository = new Repository<LichLamViec>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
             this._donviService = new DonViTrucService(repositoryDonVi, unitOfWork);
            this._lichlamviecService = new LichLamViecService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            var lichlamviec = new LichLamViec
            {
                NguoiTruc = txtHoVaTen.Text,
                DonViTrucId = Convert.ToInt32(ddlDonViTruc.SelectedValue),
                MoTaTrucCaNgay = ltrMoTaTrucCaNgay.Text,
                MoTaTrucBuoiSang = ltrMoTaTrucBuoiSang.Text,
                MoTaTrucBuoiChieu = ltrMoTaTrucBuoiChieu.Text,
                GioTrucSang = txtGioTrucSang.Text,
                GioTrucChieu = txtGioTrucChieu.Text,
                GioTrucCaNgay = txtGioTrucCaNgay.Text,
                TrucCaNgay = cbTrucCaNgay.Checked,
                NgayTruc = DateTime.Parse(Request.Form[txtNgayTruc.UniqueID]),
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _lichlamviecService.Add(lichlamviec);

            Response.Redirect("DanhSachLichLamViec.aspx");
            
        }

        private void LoadDropdownList()
        {
            ddlDonViTruc.DataTextField = "Ten";
            ddlDonViTruc.DataValueField = "Ma";
            ddlDonViTruc.DataSource = _donviService.GetAll().Select(cb => new {cb.Ma, cb.Ten}).ToList();
            ddlDonViTruc.DataBind();
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhSachLichLamViec.aspx");
        }
    }
}