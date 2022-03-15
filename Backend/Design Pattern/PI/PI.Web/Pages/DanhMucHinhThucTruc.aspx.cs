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
    public partial class DanhMucHinhThucTruc : System.Web.UI.Page
    {
        private readonly IHinhThucTrucService _dinhthuctrucService;

        public DanhMucHinhThucTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<HinhThucTruc> repository = new Repository<HinhThucTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._dinhthuctrucService = new HinhThucTrucService(repository, unitOfWork);
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
            GridViewCtr.DataSource = _dinhthuctrucService.GetAll().ToList();
            GridViewCtr.DataBind();
        }

        protected void GridViewCtr_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
        {
            GridViewCtr.EditIndex = -1;
            BindData();
        }
       
        protected void btnThemMoi_Click(object sender, EventArgs e)
        {
            Response.Redirect("ThemMoiHinhThucTruc.aspx");
        }
    }
}