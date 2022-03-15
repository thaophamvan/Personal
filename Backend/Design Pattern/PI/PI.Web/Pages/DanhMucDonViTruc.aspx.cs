using System;
using System.Linq;
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
    public partial class DanhMucDonViTruc : System.Web.UI.Page
    {
        private readonly IDonViTrucService _donviService;

        public DanhMucDonViTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonViTruc> repository = new Repository<DonViTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._donviService = new DonViTrucService(repository, unitOfWork);
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
            GridViewCtr.DataSource = _donviService.GetAll().ToList();
            GridViewCtr.DataBind();
        }
       
        protected void btnThemMoi_Click(object sender, EventArgs e)
        {
            Response.Redirect("ThemMoiDonViTruc.aspx");
        }
    }
}