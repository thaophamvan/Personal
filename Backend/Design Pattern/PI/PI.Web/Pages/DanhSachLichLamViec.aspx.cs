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

namespace PI.Web.Pages
{
    public partial class DanhSachLichLamViec : System.Web.UI.Page
    {
        private readonly ILichLamViecService _lichlamviecService;

        public DanhSachLichLamViec()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<LichLamViec> repository = new Repository<LichLamViec>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._lichlamviecService = new LichLamViecService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            lblResult.Text = string.Empty;
            
            if (IsPostBack == false)
            {
                BindData();
            }
        }
        private void BindData()
        {
            var lichlamviec = _lichlamviecService.GetAll().ToList().Select(tb => new
            {
                Ma = tb.Ma,
                NguoiTruc = tb.NguoiTruc,
                TenDonViTruc = tb.DonViTruc.Ten,
                MoTaTrucCaNgay = tb.MoTaTrucCaNgay,
                MoTaTrucBuoiSang = tb.MoTaTrucBuoiSang,
                MoTaTrucBuoiChieu = tb.MoTaTrucBuoiChieu,
                GioTrucSang = tb.GioTrucSang,
                GioTrucChieu = tb.GioTrucChieu,
                GioTrucCaNgay = tb.GioTrucCaNgay,
                TrucCaNgay = tb.TrucCaNgay,
                NgayTruc = tb.NgayTruc.ToString("dd/MM/yyyy"),
                NguoiNhapMay = tb.NguoiNhapMay,
                NgayNhapMay = tb.NgayNhapMay.ToString("yyyy/MM/dd")
            }); ;

            GridViewCtr.DataSource = lichlamviec;
            GridViewCtr.DataBind();
        }
       
        protected void btnThemMoi_Click(object sender, EventArgs e)
        {
            Response.Redirect("ThemMoiLichLamViec.aspx");
        }
    }
}