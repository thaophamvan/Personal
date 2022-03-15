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
    public partial class ChucVuService : BaseService<ChucVu>, IChucVuService
    {
        public  ChucVuService(IRepository<ChucVu> repository, IUnitOfWork unitOfWork)
            :base(repository,unitOfWork)
        {

        }
       
    }
    /// <summary>
    /// Own employee services implement
    /// </summary>
    public partial class ChucVuService
    {
        public IQueryable<ChucVu> GetNewest(int quantity)
        {
            return this.GetAll()
                .OrderByDescending(p => p.Ma)
                .Take(quantity);
        }
    }
}
