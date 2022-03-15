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

namespace PI.Web.DangNhap
{
    public partial class DangNhap : System.Web.UI.Page
    {
         private readonly IUserService _userService;
         public DangNhap()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<PI.Core.Models.User> repository = new Repository<PI.Core.Models.User>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._userService = new UserService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            var user = _userService.GetMany(u=>u.TenDangNhap == txtUserName.Text && u.MatKhau == txtPass.Value);
            if(user.Any())
            {
                HttpCookie cookie = new HttpCookie("CurrentUser");
                cookie.Value = user.FirstOrDefault().TenDangNhap;
                cookie.Expires = DateTime.Now.AddDays(1);
                Response.Cookies.Add(cookie);
                Response.Redirect("../User/DanhMucUser.aspx");
            }
            else
            {
                lblThongbao.Text = "Tên đăng nhập hoặc mật khẩu sai!";
            }
        }
    }
}