using System;
using System.Globalization;
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
    public partial class SuaCapBac : System.Web.UI.Page
    {
        int _capbacId = 0;
        private readonly ICapBacService _chucvuService;

        public SuaCapBac()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<CapBac> repository = new Repository<CapBac>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new CapBacService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhMucCapBac.aspx");
                }

                try
                {
                    _capbacId = Convert.ToInt32(id);
                    CapBac capbac = _chucvuService.GetById(_capbacId);

                    txtTen.Text = capbac.Ten;
                    txtMoTa.Text = capbac.MoTa;
                }
                catch (Exception)
                {
                    Response.Redirect("DanhMucCapBac.aspx");
                }
            }
           
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucCapBac.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {

            string id = Request.QueryString["id"] as string;
            _capbacId = Convert.ToInt32(id);
            var capbac = new CapBac
            {
                Ma = _capbacId,
                Ten = txtTen.Text,
                MoTa = txtMoTa.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _chucvuService.Update(capbac);
            Response.Redirect("DanhMucCapBac.aspx");
           
        }
    }
}