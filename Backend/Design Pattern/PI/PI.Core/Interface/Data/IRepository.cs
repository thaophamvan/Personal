using System;
using System.Linq;
using System.Linq.Expressions;

namespace PI.Core.Interface.Data
{
    public interface IRepository<T> where T:class
    {
        /// <summary>
        /// Returns the elements of type T
        /// </summary>
        IQueryable<T> Entities { get; }

        /// <summary>
        /// Get all elements
        /// </summary>
        /// <returns></returns>
        IQueryable<T> GetAll();

        /// <summary>
        /// Get all elements
        /// </summary>
        /// <returns></returns>
        IQueryable<T> GetAllLookUp();
        
        // Get all but read only
        IQueryable<T> GetAllReadOnly();

        /// <summary>
        /// Get element by id return null if not found
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        T GetById(int id);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        T GetById(int? id);

        /// <summary>
        /// Get by condiction
        /// </summary>
        /// <param name="where"></param>
        /// <returns></returns>
        T Get(Expression<Func<T, bool>> where);

        /// <summary>
        /// Add new element
        /// </summary>
        /// <param name="entity"></param>
        void Add(T entity);

        /// <summary>
        /// Update element
        /// </summary>
        /// <param name="entity"></param>
        void Update(T entity);

        /// <summary>
        /// Delete element
        /// </summary>
        /// <param name="entity"></param>
        void Delete(T entity);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="where"></param>
        void Delete(Expression<Func<T, bool>> where);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="entity"></param>
        void DeletePersistent(T entity);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="where"></param>
        void DeletePersistent(Expression<Func<T, bool>> where);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="where"></param>
        /// <param name="maHints"></param>
        /// <returns></returns>
        IQueryable<T> GetMany(Expression<Func<T, bool>> where, int? maHints = null);
    }
}
