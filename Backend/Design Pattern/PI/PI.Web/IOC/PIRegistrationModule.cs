using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Ninject;
using Ninject.Syntax;
using PI.Core.Interface.Service.BusinessInterface;
using PI.Core.Interface.UnitOfWork;
using PI.Data;
using PI.Data.Interface;
using PI.Data.UnitOfWork;
using PI.Services.Business;

namespace PI.Web.IOC
{
    public class PiRegistrationModule : IDependencyResolver
    {
        private IKernel kernel;

        public PiRegistrationModule()
        {
            kernel = new StandardKernel();
            AddBinding();
        }


        public object GetService(Type serviceType)
        {
            return kernel.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return kernel.GetAll(serviceType);
        }

        private void AddBinding()
        {
            kernel.Bind<IUnitOfWork>().To<UnitOfWork>().InSingletonScope();
            kernel.Bind<IDatabaseFactory>().To<DatabaseFactory>().InSingletonScope();
            kernel.Bind<IChucVuService>().To<ChucVuService>().InSingletonScope();
        }
    }
}