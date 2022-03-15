using System;

namespace PI.Data.Interface
{
    public interface IDatabaseFactory:IDisposable
    {
        IDataContext Get();
    }
}
