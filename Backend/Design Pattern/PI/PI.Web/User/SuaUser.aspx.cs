using PI.Common.User;
using PI.Core.Interface.Data;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Data;
using PI.Data.Interface;
using PI.Data.UnitOfWork;
using PI.Services.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PI.Web.User
{
    public partial class SuaUser : System.Web.UI.Page
    {
        int _userId = 0;
        private readonly IUserService _userService;

        public SuaUser()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<PI.Core.Models.User> repository = new Repository<PI.Core.Models.User>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._userService = new UserService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
               
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhMucUser.aspx");
                }

                try
                {
                    _userId = Convert.ToInt32(id);
                    PI.Core.Models.User user = _userService.GetById(_userId);
                    txtName.Text = user.HoVaTen.ToString();
                    txtAccount.Text = user.TenDangNhap;
                    txtPassword.Text = user.MatKhau;
                }
                catch (Exception)
                {
                    Response.Redirect("DanhMucUser.aspx");
                } 
            }
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucUser.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            string id = Request.QueryString["id"] as string;
            _userId = Convert.ToInt32(id);
            var user = new PI.Core.Models.User
            {
                Ma = _userId,
                HoVaTen = txtName.Text,
                TenDangNhap = txtAccount.Text,
                MatKhau = txtPassword.Text,
                NguoiNhapMay = Request.Cookies["CurrentUser"].Value,
                NgayNhapMay = DateTime.Now
            };

            _userService.Update(user);
            Response.Redirect("DanhMucUser.aspx");
        }
    }
}