using System;
using System.Web.UI;
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
    public partial class ThemMoiCapBac : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
          
        }
        private readonly ICapBacService _capbacService;
        public ThemMoiCapBac()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<CapBac> repository = new Repository<CapBac>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._capbacService = new CapBacService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            var capbac = new CapBac
            {
                Ten = txtName.Text,
                MoTa = txtDescription.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _capbacService.Add(capbac);

            Response.Redirect("DanhMucCapBac.aspx");
            
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucCapBac.aspx");
        }
    }
}