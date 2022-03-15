using System;
using System.Globalization;
using System.Linq;
using System.Web.UI.WebControls;
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
    public partial class SuaTrucBan : System.Web.UI.Page
    {
        int _trucBanId = 0;
        private readonly ITrucBanService _trucbanService;
        private readonly IChucVuService _chucvuService;
        private readonly ICapBacService _capbacService;
        private readonly IDonViService _donviService;
        private readonly IHinhThucTrucService _hinhthuctrucService;

        public SuaTrucBan()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<TrucBan> repositoryTrucBan = new Repository<TrucBan>(databaseFactory);
            IRepository<ChucVu> repositoryChucVu = new Repository<ChucVu>(databaseFactory);
            IRepository<DonVi> repositoryDonVi = new Repository<DonVi>(databaseFactory);
            IRepository<CapBac> repositoryCapBac = new Repository<CapBac>(databaseFactory);
            IRepository<HinhThucTruc> repositoryHinhThucTruc = new Repository<HinhThucTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._trucbanService = new TrucBanService(repositoryTrucBan, unitOfWork);
            this._donviService = new DonViService(repositoryDonVi, unitOfWork);
            this._capbacService = new CapBacService(repositoryCapBac, unitOfWork);
            this._chucvuService = new ChucVuService(repositoryChucVu, unitOfWork);
            this._hinhthuctrucService = new HinhThucTrucService(repositoryHinhThucTruc, unitOfWork);
        }
        private void LoadDropdownList()
        {
            ddlCapBac.DataTextField = "Ten";
            ddlCapBac.DataValueField = "Ma";
            ddlCapBac.DataSource = _capbacService.GetAll().Select(cb => new { cb.Ma, cb.Ten }).ToList();
            ddlCapBac.DataBind();

            ddlDonVi.DataTextField = "Ten";
            ddlDonVi.DataValueField = "Ma";
            ddlDonVi.DataSource = _donviService.GetAll().Select(cb => new { cb.Ma, cb.Ten }).ToList();
            ddlDonVi.DataBind();

            ddlChucVu.DataTextField = "Ten";
            ddlChucVu.DataValueField = "Ma";
            ddlChucVu.DataSource = _chucvuService.GetAll().Select(cb => new { cb.Ma, cb.Ten }).ToList();
            ddlChucVu.DataBind();

            ddlHinhThucTruc.DataTextField = "Ten";
            ddlHinhThucTruc.DataValueField = "Ma";
            ddlHinhThucTruc.DataSource = _hinhthuctrucService.GetAll().Select(cb => new { cb.Ma, cb.Ten }).ToList();
            ddlHinhThucTruc.DataBind();

            var items = new ListItem[3];
            items[0] = new ListItem("", "");
            items[1] = new ListItem("Ngày", "Ngày");
            items[2] = new ListItem("Đêm", "Đêm");
            ddCaTruc.Items.AddRange(items);
            ddCaTruc.DataBind();
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                LoadDropdownList();
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhSachTrucBan.aspx");
                }

                try
                {
                    _trucBanId = Convert.ToInt32(id);
                    TrucBan trucban = _trucbanService.GetById(_trucBanId);
                    txtHoVaTen.Text= trucban.HoVaTen;
                    ddlDonVi.SelectedValue = trucban.DonViId.ToString();
                    ddlCapBac.SelectedValue = trucban.CapBacId.ToString();
                    ddlChucVu.SelectedValue = trucban.ChucVuId.ToString();
                    ddlHinhThucTruc.SelectedValue = trucban.HinhThucTrucId.ToString();
                  
                    txtTuNgay.Text = trucban.ThoiGianTu.ToString("yyyy/MM/dd HH':'mm");
                    txtDenNgay.Text = trucban.ThoiGianDen.ToString("yyyy/MM/dd HH':'mm");

                    ddCaTruc.SelectedValue = trucban.CaTruc;
                    txtKipTruc.Text = trucban.KipTruc.HasValue? trucban.KipTruc.ToString():"";
                }
                catch (Exception)
                {
                    Response.Redirect("DanhSachTrucBan.aspx");
                }
            }
           
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhSachTrucBan.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {

            var id = Request.QueryString["id"] as string;
            _trucBanId = Convert.ToInt32(id);
            var trucban = new TrucBan();
            trucban.Ma = _trucBanId;
            //trucban.ThuTu = string.IsNullOrWhiteSpace(txtThuTu.Text) ? 1 : Convert.ToInt32(txtThuTu.Text);
            trucban.HoVaTen = txtHoVaTen.Text;
            trucban.DonViId = Convert.ToInt32(ddlDonVi.SelectedValue);
            trucban.CapBacId = Convert.ToInt32(ddlCapBac.SelectedValue);
            trucban.ChucVuId = Convert.ToInt32(ddlChucVu.SelectedValue);
            trucban.HinhThucTrucId = Convert.ToInt32(ddlHinhThucTruc.SelectedValue);
           
            trucban.ThoiGianTu = DateTime.Parse(Request.Form[txtTuNgay.UniqueID]);
            trucban.ThoiGianDen = DateTime.Parse(Request.Form[txtDenNgay.UniqueID]);

            trucban.CaTruc = ddCaTruc.SelectedValue;
            trucban.KipTruc = string.IsNullOrWhiteSpace(txtKipTruc.Text) ? (int?) null : Convert.ToInt32(txtKipTruc.Text);

            trucban.NguoiNhapMay = PiUser.Instance.UserLoggedIn;
            trucban.NgayNhapMay = DateTime.Now;
            _trucbanService.Update(trucban);
            Response.Redirect("DanhSachTrucBan.aspx");
           
        }
    }
}