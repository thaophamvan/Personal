using PI.Core.Interface.UnitOfWork;
using PI.Data.Interface;

namespace PI.Data.UnitOfWork
{
    public class UnitOfWork:IUnitOfWork
    {
        private readonly IDatabaseFactory _databaseFactory;
        private IDataContext _dataContext;

        protected IDataContext DataContext
        {
            get
            {
                return _dataContext ?? (_dataContext = _databaseFactory.Get());
            }
        }

        public UnitOfWork(IDatabaseFactory databaseFactory)
        {
            this._databaseFactory = databaseFactory;
        }
        public int Commit()
        {
            return DataContext.Commit();
        }
    }
}
