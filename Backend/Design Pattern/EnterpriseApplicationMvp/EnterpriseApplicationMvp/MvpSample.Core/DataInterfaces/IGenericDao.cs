using System;
using System.Collections.Generic;

namespace MvpSample.Core.DataInterfaces
{
    public interface IGenericDao<T, ID>
    {
        T GetById(ID id, bool shouldLock);
        List<T> GetAll();
        List<T> GetByExample(T exampleInstance, params string[] propertiesToExclude);
        T GetUniqueByExample(T exampleInstance, params string[] propertiesToExclude);
        T Save(T entity);
        T SaveOrUpdate(T entity);
        void Delete(T entity);

        /// <summary>
        /// Commits all of the changes thus far to the storage system
        /// </summary>
        void CommitChanges();
    }
}
