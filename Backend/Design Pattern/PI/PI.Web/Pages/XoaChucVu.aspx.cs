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
    public partial class XoaChucVu : System.Web.UI.Page
    {
        int _chucVuId = 0;
        private readonly IChucVuService _chucvuService;

        public XoaChucVu()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<ChucVu> repository = new Repository<ChucVu>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new ChucVuService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhMucChucVu.aspx");
            }

            try
            {
                _chucVuId = Convert.ToInt32(id);
                ChucVu chucVu = _chucvuService.GetById(_chucVuId);

                lblMa.Text = chucVu.Ma.ToString(CultureInfo.InvariantCulture);
                lblTen.Text = chucVu.Ten;
                lblMoTa.Text = chucVu.MoTa;
                lblNguoINhapMay.Text = chucVu.NguoiNhapMay;
                lblNgayNhapMay.Text = chucVu.NgayNhapMay.ToString();
            }
            catch (Exception)
            {
                Response.Redirect("DanhMucChucVu.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucChucVu.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            ChucVu chucVu = _chucvuService.GetById(_chucVuId);
            _chucvuService.Delete(chucVu);
            Response.Redirect("DanhMucChucVu.aspx");
           
        }
    }
}