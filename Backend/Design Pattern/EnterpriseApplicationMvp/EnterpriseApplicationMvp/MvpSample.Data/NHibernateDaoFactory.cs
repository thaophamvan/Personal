using MvpSample.Core.DataInterfaces;
using MvpSample.Core.Domain;

namespace MvpSample.Data
{
    /// <summary>
    /// Exposes access to NHibernate DAO classes.  Motivation for this DAO
    /// framework can be found at http://www.hibernate.org/328.html.
    /// </summary>
    public class NHibernateDaoFactory : IDaoFactory
    {
        public ICustomerDao GetCustomerDao() {
            return new CustomerDaoNHibernate();
        }

        public IOrderDao GetOrderDao() {
            return new OrderDaoNHibernate();
        }

        #region Inline DAO implementations

        /// <summary>
        /// Concrete DAO for accessing instances of <see cref="Customer" /> from DB.
        /// This should be extracted into its own class-file if it needs to extend the
        /// inherited DAO functionality.
        /// </summary>
        public class CustomerDaoNHibernate : GenericNHibernateDao<Customer, string>, ICustomerDao { }

        /// <summary>
        /// Concrete DAO for accessing instances of <see cref="Order" /> from DB.
        /// </summary>
        public class OrderDaoNHibernate : GenericNHibernateDao<Order, long>, IOrderDao { }

        #endregion
    }
}
