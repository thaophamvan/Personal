using PI.Core.Interface.Data;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PI.Services.Business
{
    public partial class UserService : BaseService<User>, IUserService
    {
        public UserService(IRepository<User> repository, IUnitOfWork unitOfWork)
            : base(repository, unitOfWork)
        {

        }
    }
}
