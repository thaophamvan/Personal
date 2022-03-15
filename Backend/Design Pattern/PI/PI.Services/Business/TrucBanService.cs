using System.Linq;
using PI.Core.Interface.Data;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Core.Models;

namespace PI.Services.Business
{
    /// <summary>
    /// Common base services implement
    /// </summary>
    public partial class TrucBanService : BaseService<TrucBan>, ITrucBanService
    {
        public TrucBanService(IRepository<TrucBan> repository, IUnitOfWork unitOfWork)
            :base(repository,unitOfWork)
        {

        }
       
    }
    /// <summary>
    /// Own DanhSachTrucBanService services implement
    /// </summary>
    //public partial class TrucBanService
    //{
    //    public IQueryable<TrucBan> GetNewest(int quantity)
    //    {
    //        return this.GetAll()
    //            .OrderByDescending(p => p.MaTrucBan)
    //            .Take(quantity);
    //    }
    //}
}
