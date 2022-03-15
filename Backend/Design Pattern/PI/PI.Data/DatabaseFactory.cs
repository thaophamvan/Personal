using PI.Common.Disposable;
using PI.Data.Interface;

namespace PI.Data
{
    public class DatabaseFactory : Disposable, IDatabaseFactory
    {
        private IDataContext _dataContext;
        public IDataContext Get()
        {
            return _dataContext ?? (_dataContext = new PiDbContext());
        }

        protected override void DisposeCore() 
        {
            if (_dataContext != null) _dataContext.Dispose();
        }
    }
}
