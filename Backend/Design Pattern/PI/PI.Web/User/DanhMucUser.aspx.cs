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

namespace PI.Web.User
{
    public partial class DanhMucUser : System.Web.UI.Page
    {
        private readonly IUserService _userService;
        public DanhMucUser()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<PI.Core.Models.User> repository = new Repository<PI.Core.Models.User>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._userService = new UserService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            lblResult.Text = string.Empty;

            if (IsPostBack == false)
            {
                try
                {
                    lblResult.Text = string.Empty;
                    BindData();  
                }
                catch
                {
                    Response.Redirect("../DangNhap/DangNhap.aspx");
                }
            }
        }

        private void BindData()
        {
            GridViewCtr.DataSource = _userService.GetAll().ToList();
            GridViewCtr.DataBind();
        }

        protected void btnThemMoi_Click(object sender, EventArgs e)
        {
            Response.Redirect("ThemMoiUser.aspx");
        }
    }
}