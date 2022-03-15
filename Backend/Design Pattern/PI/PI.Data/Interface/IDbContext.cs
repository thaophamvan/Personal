using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace PI.Data.Interface
{
    public interface IDataContext:IDisposable
    {

        IDbSet<T> DbSet<T>() where T : class;
        DbEntityEntry<T> EntryGet<T>(T entity) where T : class;
        int Commit(); 
    }
}
