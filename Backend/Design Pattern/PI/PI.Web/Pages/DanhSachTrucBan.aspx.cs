using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Ninject;
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
    public partial class DanhSachTrucBan : System.Web.UI.Page
    {
        private readonly ITrucBanService _trucbanService;

        public DanhSachTrucBan()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<TrucBan> repository = new Repository<TrucBan>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._trucbanService = new TrucBanService(repository, unitOfWork);
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
            var trucban = _trucbanService.GetAll().ToList().Select(tb =>new
            {
                Ma = tb.Ma,
                HoVaTen = tb.HoVaTen,
                DonVi = tb.DonVi.Ten,
                CapBac = tb.CapBac.Ten,
                ChucVu = tb.ChucVu.Ten,
                HinhThucTruc = tb.HinhThucTruc.Ten,
                ThoiGianTu = tb.ThoiGianTu.ToString("dd/MM/yyyy"),
                ThoiGianDen = tb.ThoiGianDen.ToString("dd/MM/yyyy"),
                KipTruc = tb.KipTruc,
                CaTruc = tb.CaTruc,
                NguoiNhapMay = tb.NguoiNhapMay,
                NgayNhapMay = tb.NgayNhapMay.ToString("yyyy/MM/dd")
            });;

            GridViewCtr.DataSource = trucban;
            GridViewCtr.DataBind();
        }

        protected void GridViewCtr_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            GridViewCtr.EditIndex = -1;
            BindData();
        }
       
        protected void btnThemMoi_Click(object sender, EventArgs e)
        {
            Response.Redirect("ThemMoiTrucBan.aspx");
        }
    }
}