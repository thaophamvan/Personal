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
    public partial class XoaLichLamViec : System.Web.UI.Page
    {
        int _lichlamviecId = 0;
        private readonly ILichLamViecService _lichlamviecService;

        public XoaLichLamViec()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<LichLamViec> repository = new Repository<LichLamViec>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._lichlamviecService = new LichLamViecService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhSachLichLamViec.aspx");
            }

            try
            {
                _lichlamviecId = Convert.ToInt32(id);
                LichLamViec lichlamviec = _lichlamviecService.GetById(_lichlamviecId);

                lblHoVaTen.Text = lichlamviec.NguoiTruc;
                lblDonViTruc.Text = lichlamviec.DonViTrucId.ToString();
                lblHoVaTen.Text = lichlamviec.NguoiTruc;
                lblMoTaTrucCaNgay.Text = lichlamviec.MoTaTrucCaNgay;
                lblMoTaTrucBuoiSang.Text = lichlamviec.MoTaTrucBuoiSang;
                lblMoTaTrucBuoiChieu.Text = lichlamviec.MoTaTrucBuoiChieu;
                lblGioTrucSang.Text = lichlamviec.GioTrucSang;
                lblGioTrucChieu.Text = lichlamviec.GioTrucChieu;
                lblGioTrucCaNgay.Text = lichlamviec.GioTrucCaNgay;
                lblTrucCaNgay.Text = lichlamviec.TrucCaNgay.ToString();
                lblNgayTruc.Text = lichlamviec.NgayTruc.ToString("yyyy/MM/dd HH':'mm");
            }
            catch (Exception)
            {
                Response.Redirect("DanhSachLichLamViec.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhSachLichLamViec.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            LichLamViec lichlamviec = _lichlamviecService.GetById(_lichlamviecId);
            _lichlamviecService.Delete(lichlamviec);
            Response.Redirect("DanhSachLichLamViec.aspx");
           
        }
    }
}