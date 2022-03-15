using System;
using System.Globalization;
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
    public partial class SuaHinhThucTruc : System.Web.UI.Page
    {
        int _hinhthuctrucId = 0;
        private readonly IHinhThucTrucService _chucvuService;

        public SuaHinhThucTruc()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<HinhThucTruc> repository = new Repository<HinhThucTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._chucvuService = new HinhThucTrucService(repository, unitOfWork);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack == false)
            {
                string id = Request.QueryString["id"] as string;

                if (id == null)
                {
                    Response.Redirect("DanhMucHinhThucTruc.aspx");
                }

                try
                {
                    _hinhthuctrucId = Convert.ToInt32(id);
                    HinhThucTruc hinhthuctruc = _chucvuService.GetById(_hinhthuctrucId);
                    txtTT.Text = hinhthuctruc.TT.ToString();
                    txtTen.Text = hinhthuctruc.Ten;
                    txtMoTa.Text = hinhthuctruc.MoTa;
                }
                catch (Exception)
                {
                    Response.Redirect("DanhMucHinhThucTruc.aspx");
                }
            }
           
        }
        protected void btnNO_Click(object sender, EventArgs e)
        {
            Response.Redirect("DanhMucHinhThucTruc.aspx");
        }

        protected void btnYES_Click(object sender, EventArgs e)
        {

            string id = Request.QueryString["id"] as string;
            _hinhthuctrucId = Convert.ToInt32(id);
            var hinhthuctruc = new HinhThucTruc
            {
                Ma = _hinhthuctrucId,
                TT = Convert.ToInt32(txtTT.Text),
                Ten = txtTen.Text,
                MoTa = txtMoTa.Text,
                NguoiNhapMay = PiUser.Instance.UserLoggedIn,
                NgayNhapMay = DateTime.Now
            };

            _chucvuService.Update(hinhthuctruc);
            Response.Redirect("DanhMucHinhThucTruc.aspx");
           
        }
    }
}