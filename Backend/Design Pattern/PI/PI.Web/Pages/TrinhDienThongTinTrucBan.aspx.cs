using System.Collections.Generic;
using System.Linq;
using System.Web.UI.WebControls;
using PI.Common.StringUlti;
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
    public partial class TrinhDienThongTinTrucBan : System.Web.UI.Page
    {
        private readonly ITrucBanService _trucbanService;
        private readonly IChucVuService _chucvuService;
        private readonly ICapBacService _capbacService;
        private readonly IDonViService _donviService;
        private readonly IHinhThucTrucService _hinhthuctrucService;
        
        public int index = 0;

        public TrinhDienThongTinTrucBan()
        {
            IDatabaseFactory databaseFactory = new DatabaseFactory();
            IRepository<TrucBan> repositoryTrucBan = new Repository<TrucBan>(databaseFactory);
            IRepository<ChucVu> repositoryChucVu = new Repository<ChucVu>(databaseFactory);
            IRepository<DonVi> repositoryDonVi = new Repository<DonVi>(databaseFactory);
            IRepository<CapBac> repositoryCapBac = new Repository<CapBac>(databaseFactory);
            IRepository<HinhThucTruc> repositoryHinhThucTruc = new Repository<HinhThucTruc>(databaseFactory);
            IUnitOfWork unitOfWork = new UnitOfWork(databaseFactory);
            this._trucbanService = new TrucBanService(repositoryTrucBan, unitOfWork);
            this._donviService = new DonViService(repositoryDonVi, unitOfWork);
            this._capbacService = new CapBacService(repositoryCapBac, unitOfWork);
            this._chucvuService = new ChucVuService(repositoryChucVu, unitOfWork);
            this._hinhthuctrucService = new HinhThucTrucService(repositoryHinhThucTruc, unitOfWork);
        
        }

        public List<DonVi> DanhMucDonVi()
        {
            return _donviService.GetAll().ToList();
        }
        public List<HinhThucTruc> DanhMucHinhThucTruc()
        {
            return _hinhthuctrucService.GetAll().ToList();
        }
        public List<TrucBan> LocDanhSachTrucBan(int madonvi, int mahinhthuctruc)
        {
            return _trucbanService.GetMany(tb => tb.DonViId == madonvi && tb.HinhThucTrucId == mahinhthuctruc).OrderBy(s => s.ThoiGianTu).ToList();
            ;
        }
    }
}