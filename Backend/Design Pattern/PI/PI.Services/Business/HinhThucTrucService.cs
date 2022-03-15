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
    public partial class HinhThucTrucService : BaseService<HinhThucTruc>, IHinhThucTrucService
    {
        public HinhThucTrucService(IRepository<HinhThucTruc> repository, IUnitOfWork unitOfWork)
            :base(repository,unitOfWork)
        {

        }
       
    }
}
