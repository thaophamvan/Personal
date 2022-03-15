using System;
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
    public partial class SuaDonViTruc : System.Web.UI.Page
    {
        int _donviId = 0;
        private readonly IDonViTrucService _chucvuService;

        public SuaDonViTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<DonViTruc> repository = new Repository<DonViTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new DonViTrucService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhMucDonViTruc.aspx");
                }

                try
                {
                    _donviId = Convert.ToInt32(id);
                    DonViTruc donvi = _chucvuService.GetById(_donviId);
                    txtTen.Text = donvi.Ten;
                    txtMoTa.Text = donvi.MoTa;
                }
                catch (Exception)
                {
                    Response.Redirect("DanhMucDonViTruc.aspx");
                }
            }
           
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucDonViTruc.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {

            string id = Request.QueryString["id"] as string;
            _donviId = Convert.ToInt32(id);
            var donvi = new DonViTruc
            {
                Ma = _donviId,
                Ten = txtTen.Text,
                MoTa = txtMoTa.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _chucvuService.Update(donvi);
            Response.Redirect("DanhMucDonViTruc.aspx");
           
        }
    }
}