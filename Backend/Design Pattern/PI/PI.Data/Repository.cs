using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using PI.Core.Interface.Data;
using PI.Data.Interface;

namespace PI.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly IDbSet<T> _dbSet;
        private IDataContext _dataContext;
        private readonly IDatabaseFactory _databaseFactory;

        protected IDbSet<T> DbSet
        {
            get { return _dbSet; }
        }

        protected IDatabaseFactory DatabaseFactory
        {
            get { return _databaseFactory; }
        }

        protected IDataContext DataContext
        {
            get { return _dataContext ?? (_dataContext = _databaseFactory.Get()); }
        }
        public Repository(IDatabaseFactory databaseFactory)
        {
            this._databaseFactory = databaseFactory;
            this._dbSet = DataContext.DbSet<T>();
        }

        public IQueryable<T> Entities
        {
            get 
            {
                return DbSet;
            }
        }

        public IQueryable<T> GetAll()
        {
            return Entities;
        }

        public IQueryable<T> GetAllLookUp()
        {
            return Entities;
        }

        public IQueryable<T> GetAllReadOnly()
        {
            return Entities.AsNoTracking();
        }

        public T GetById(int id)
        {
            T result = DbSet.Find(id);
            if (result == null) return null;
            return  result;
        }

        public T GetById(int? id)
        {
            if (id == null) return null;
            return GetById((int)id);
        }

        public T Get(Expression<Func<T, bool>> where)
        {
            return Entities.Where(where).SingleOrDefault();
        }

        public void Add(T entity)
        {
            try
            {
                if (entity == null) throw new NullReferenceException("Add");
                DbSet.Add(entity);
            }
            catch (Exception ex)
            {
                
                throw ex;
            }
           
        }

        public void Update(T entity)
        {
            if (entity == null) throw new NullReferenceException("Update");
            DataContext.EntryGet(entity).State = EntityState.Modified;
        }

        public void Delete(T entity)
        {
            if (entity == null) throw new NullReferenceException("Delete");

            DbSet.Remove(entity);
        }

        public void Delete(Expression<Func<T, bool>> where)
        {
            IQueryable<T> list = Entities.Where(where);
            foreach (var obj in list)
                Delete(obj);
        }

        public void DeletePersistent(T entity)
        {
            if (entity == null) throw new NullReferenceException("DeletePersistent");
            DataContext.EntryGet(entity).State = EntityState.Deleted;
        }

        public void DeletePersistent(Expression<Func<T, bool>> where)
        {
            IQueryable<T> list = Entities.Where(where);
            foreach (var obj in list)
                DeletePersistent(obj);
        }

        public IQueryable<T> GetMany(Expression<Func<T, bool>> where, int? maxHints = null)
        {
            var result = Entities.Where(where);
            if (maxHints != null)
            {
                int value = (int)maxHints;
                result = result.Take(value);
            }
            return result;
        }
    }
}
