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
    public partial class XoaUser : System.Web.UI.Page
    {
        int _userId = 0;
        private readonly IUserService _userService;

        public XoaUser()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<PI.Core.Models.User> repository = new Repository<PI.Core.Models.User>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._userService = new UserService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
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

                lblName.Text = user.HoVaTen.ToString();
                lblAccount.Text = user.TenDangNhap.ToString();                
            }
            catch (Exception)
            {
                Response.Redirect("DanhMucUser.aspx");
            }
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {
            PI.Core.Models.User user = _userService.GetById(_userId);
            _userService.Delete(user);
            Response.Redirect("DanhMucUser.aspx");
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucUser.aspx");
        }
    }
}