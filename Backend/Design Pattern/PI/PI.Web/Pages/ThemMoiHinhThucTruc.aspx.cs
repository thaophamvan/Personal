using System;
using PI.Core.Interface.Data;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Core.Models;
using PI.Data;
using PI.Data.Interface;
using PI.Data.UnitOfWork;
using PI.Services.Business;
using PI.Common.User;

namespace PI.Web.Pages
{
    public partial class ThemMoiHinhThucTruc : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        private readonly IHinhThucTrucService _hinhthuctrucService;
        public ThemMoiHinhThucTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<HinhThucTruc> repository = new Repository<HinhThucTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._hinhthuctrucService = new HinhThucTrucService(repository, unitOfWork);
        }
        protected void btnYES_Click(object sender, EventArgs e)
        {
            var hinhthuctruc = new HinhThucTruc
            {
                TT = Convert.ToInt32(txtTT.Text),
                Ten = txtName.Text,
                MoTa = txtDescription.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _hinhthuctrucService.Add(hinhthuctruc);

            Response.Redirect("DanhMucHinhThucTruc.aspx");
            
        }

        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucHinhThucTruc.aspx");
        }
    }
}