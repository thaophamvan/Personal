using System;
using System.Linq;
using System.Linq.Expressions;
using PI.Core.Interface.Data;
using PI.Core.Interface.Service;
using PI.Core.Interface.UnitOfWork;

namespace PI.Services
{
    public class BaseService<T>:IService<T> where T :class 
    {
        protected readonly IRepository<T> Repository;
        protected readonly IUnitOfWork UnitOfWork;

        protected BaseService( IRepository<T> repository,IUnitOfWork unitOfWork)
        {
            this.Repository = repository;
            this.UnitOfWork = unitOfWork;
        }

        public IQueryable<T> Entities
        {
            get { return Repository.Entities; }
        }

        public IQueryable<T> GetAll()
        {
            return Repository.GetAll();
        }

        public IQueryable<T> GetAllLookUp()
        {
            return Repository.GetAllLookUp();
        }

        public IQueryable<T> GetAllReadOnly()
        {
            return Repository.GetAllReadOnly();
        }

        public T GetById(int id)
        {
            return Repository.GetById(id);
        }

        public T GetById(int? id)
        {
            return Repository.GetById(id);
        }

        public T Get(Expression<Func<T, bool>> where)
        {
            return Repository.Get(where);
        }

        public void Add(T entity)
        {
            Repository.Add(entity);
            UnitOfWork.Commit();
        }

        public void Update(T entity)
        {
            Repository.Update(entity);
            UnitOfWork.Commit();
        }

        public void Delete(T entity)
        {
            Repository.Delete(entity);
            UnitOfWork.Commit();
        }

        public void Delete(Expression<Func<T, bool>> where)
        {
            Repository.Delete(where);
            UnitOfWork.Commit();
        }

        public IQueryable<T> GetMany(Expression<Func<T, bool>> where, int? maHints = null)
        {
            return Repository.GetMany(where, maHints);
        }
    }
}
