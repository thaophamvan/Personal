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
    public partial class DanhMucChucVu : System.Web.UI.Page
    {
        private readonly IChucVuService _chucvuService;

        public DanhMucChucVu()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<ChucVu> repository = new Repository<ChucVu>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new ChucVuService(repository, unitOfWork);
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
            GridViewCtr.DataSource = _chucvuService.GetAll().ToList();
            GridViewCtr.DataBind();
        }

        protected void GridViewCtr_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            GridViewCtr.EditIndex = -1;
            BindData();
        }
       
        protected void btnThemMoi_Click(object sender, EventArgs e)
        {
            Response.Redirect("ThemMoiChucVu.aspx");
        }
    }
}