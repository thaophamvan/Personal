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
    public partial class XoaTrucBan : System.Web.UI.Page
    {
        int _trucBanId = 0;
        private readonly ITrucBanService _trucbanService;

        public XoaTrucBan()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<TrucBan> repository = new Repository<TrucBan>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._trucbanService = new TrucBanService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhSachTrucBan.aspx");
            }

            try
            {
                _trucBanId = Convert.ToInt32(id);
                TrucBan trucBan = _trucbanService.GetById(_trucBanId);
                LabelHoVaTen.Text = trucBan.HoVaTen;
                LabelDonVi.Text = trucBan.DonVi.Ten;
                LabelCapBac.Text = trucBan.CapBac.Ten;
                LabelChucVu.Text = trucBan.ChucVu.Ten;
                LabelHinhThucTruc.Text = trucBan.HinhThucTruc.Ten;
                LabelCaTruc.Text = trucBan.CaTruc;
                LabelKipTruc.Text = trucBan.KipTruc.ToString();
                LabelTuNgay.Text = trucBan.ThoiGianTu.ToString();
                LabelDenNgay.Text = trucBan.ThoiGianDen.ToString();
            }
            catch (Exception)
            {
                Response.Redirect("DanhSachTrucBan.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhSachTrucBan.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            try
            {
                TrucBan chucVu = _trucbanService.GetById(_trucBanId);
                _trucbanService.Delete(chucVu);
                Response.Redirect("DanhSachTrucBan.aspx");
            }
            catch (Exception)
            {
                Response.Redirect("DanhSachTrucBan.aspx");
                //throw;
            }
            
           
        }
    }
}