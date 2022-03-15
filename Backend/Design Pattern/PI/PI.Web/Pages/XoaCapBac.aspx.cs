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
    public partial class XoaCapBac : System.Web.UI.Page
    {
        int _chucVuId = 0;
        private readonly ICapBacService _capbacService;

        public XoaCapBac()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<CapBac> repository = new Repository<CapBac>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._capbacService = new CapBacService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;

            if (id == null)
            {
                Response.Redirect("DanhMucCapBac.aspx");
            }

            try
            {
                _chucVuId = Convert.ToInt32(id);
                CapBac chucVu = _capbacService.GetById(_chucVuId);

                lblMa.Text = chucVu.Ma.ToString(CultureInfo.InvariantCulture);
                lblTen.Text = chucVu.Ten;
                lblMoTa.Text = chucVu.MoTa;
                lblNguoINhapMay.Text = chucVu.NguoiNhapMay;
                lblNgayNhapMay.Text = chucVu.NgayNhapMay.ToString();
            }
            catch (Exception)
            {
                Response.Redirect("DanhMucCapBac.aspx");
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucCapBac.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            CapBac chucVu = _capbacService.GetById(_chucVuId);
            _capbacService.Delete(chucVu);
            Response.Redirect("DanhMucCapBac.aspx");
           
        }
    }
}