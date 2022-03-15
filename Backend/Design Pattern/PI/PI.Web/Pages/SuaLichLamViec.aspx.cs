using System;
using System.Linq;
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
    public partial class SuaLichLamViec : System.Web.UI.Page
    {
        int _lichlamviecId = 0;
        private readonly ILichLamViecService _lichlamviecService;
        private readonly IDonViTrucService _donviService;

        public SuaLichLamViec()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonViTruc> repositoryDonVi = new Repository<DonViTruc>(databaseFactory);
            IRepository<LichLamViec> repository = new Repository<LichLamViec>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._donviService = new DonViTrucService(repositoryDonVi, unitOfWork);
            this._lichlamviecService = new LichLamViecService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                LoadDropdownList();
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhSachLichLamViec.aspx");
                }

                try
                {
                    _lichlamviecId = Convert.ToInt32(id);
                    LichLamViec lichLamViec = _lichlamviecService.GetById(_lichlamviecId);
                    txtHoVaTen.Text = lichLamViec.NguoiTruc;
                    ddlDonViTruc.SelectedValue = lichLamViec.DonViTrucId.ToString();
                    txtHoVaTen.Text = lichLamViec.NguoiTruc;
                    ltrMoTaTrucCaNgay.Text = lichLamViec.MoTaTrucCaNgay;
                    ltrMoTaTrucBuoiSang.Text = lichLamViec.MoTaTrucBuoiSang;
                    ltrMoTaTrucBuoiChieu.Text = lichLamViec.MoTaTrucBuoiChieu;
                    txtGioTrucSang.Text = lichLamViec.GioTrucSang;
                    txtGioTrucChieu.Text = lichLamViec.GioTrucChieu;
                    txtGioTrucCaNgay.Text = lichLamViec.GioTrucCaNgay;
                    cbTrucCaNgay.Checked = lichLamViec.TrucCaNgay;
                    txtNgayTruc.Text = lichLamViec.NgayTruc.ToString("yyyy/MM/dd HH':'mm");
                }
                catch (Exception)
                {
                    Response.Redirect("DanhSachLichLamViec.aspx");
                }
            }
        }
        private void LoadDropdownList()
        {
            ddlDonViTruc.DataTextField = "Ten";
            ddlDonViTruc.DataValueField = "Ma";
            ddlDonViTruc.DataSource = _donviService.GetAll().Select(cb => new { cb.Ma, cb.Ten }).ToList();
            ddlDonViTruc.DataBind();
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhSachLichLamViec.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {

            string id = Request.QueryString["id"] as string;
            _lichlamviecId = Convert.ToInt32(id);
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
                NgayTruc = DateTime.Parse(txtNgayTruc.Text),
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _lichlamviecService.Update(lichlamviec);

            Response.Redirect("DanhSachLichLamViec.aspx");
        }
    }
}