using MvpSample.Core.Domain;

namespace MvpSample.Core.DataInterfaces
{
    /// <summary>
    /// Provides an interface for retrieving DAO objects
    /// </summary>
    public interface IDaoFactory 
    {
        ICustomerDao GetCustomerDao();
        IOrderDao GetOrderDao();
    }

    // There's no need to declare each of the DAO interfaces in its own file, so just add them inline here.
    // But you're certainly welcome to put each declaration into its own file.
    #region Inline interface declarations

    public interface ICustomerDao : IGenericDao<Customer, string> { }
    public interface IOrderDao : IGenericDao<Order, long> { }

    #endregion
}
