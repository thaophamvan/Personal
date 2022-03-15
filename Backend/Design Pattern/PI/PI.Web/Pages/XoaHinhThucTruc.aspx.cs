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
    public partial class XoaHinhThucTruc : System.Web.UI.Page
    {
        int _hinhthuctrucId = 0;
        private readonly IHinhThucTrucService _hinhthuctrucService;

        public XoaHinhThucTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<HinhThucTruc> repository = new Repository<HinhThucTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._hinhthuctrucService = new HinhThucTrucService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhMucHinhThucTruc.aspx");
            }

            try
            {
                _hinhthuctrucId = Convert.ToInt32(id);
                HinhThucTruc hinhthuctruc = _hinhthuctrucService.GetById(_hinhthuctrucId);

                lblMa.Text = hinhthuctruc.Ma.ToString(CultureInfo.InvariantCulture);
                lblTen.Text = hinhthuctruc.Ten;
                lblMoTa.Text = hinhthuctruc.MoTa;
                lblNguoINhapMay.Text = hinhthuctruc.NguoiNhapMay;
                lblNgayNhapMay.Text = hinhthuctruc.NgayNhapMay.ToString();
            }
            catch (Exception)
            {
                Response.Redirect("DanhMucHinhThucTruc.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucHinhThucTruc.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            HinhThucTruc hinhthuctruc = _hinhthuctrucService.GetById(_hinhthuctrucId);
            _hinhthuctrucService.Delete(hinhthuctruc);
            Response.Redirect("DanhMucHinhThucTruc.aspx");
           
        }
    }
}