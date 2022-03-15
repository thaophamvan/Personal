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
    public partial class ThemMoiUser : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
           
        }
        private readonly IUserService _userService;
        public ThemMoiUser()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<PI.Core.Models.User> repository = new Repository<PI.Core.Models.User>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._userService = new UserService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            bool check = true;
            var listUser = _userService.GetAll().ToList();
            foreach (var c in listUser)
            {
                if (c.TenDangNhap == txtAccount.Text)
                    check = false;
                else
                    check = true;
            }
            if (check)
            {
                var user = new PI.Core.Models.User
                {
                    HoVaTen = txtName.Text,
                    TenDangNhap = txtAccount.Text,
                    MatKhau = txtPassword.Value,
                    NguoiNhapMay = Request.Cookies["CurrentUser"].Value,
                    NgayNhapMay = DateTime.Now
                };
                _userService.Add(user);

                Response.Redirect("DanhMucUser.aspx");
            }
            else
                lblThongbao.Text = "Tên đăng nhập đã tồn tại.";
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucUser.aspx");
        }
    }
}