using System;
using System.Collections.Generic;
using MvpSample.Core.Domain;
using MvpSample.Core.DataInterfaces;
using MvpSample.Data;

namespace MvpSample.Tests.MockDao
{
    /// <summary>
    /// Mock DAO that can be used in place of <see cref="NHibernateDaoFactory.OrderDaoNHibernate" /> 
    /// to simulate communications with the DB without actually talking to the DB.
    /// </summary>
    public class MockOrderDao : IGenericDao<Order, long>, IOrderDao
    {
        public List<Order> GetByExample(Order exampleInstance, params string[] propertiesToExclude) {
            return CreateOrderListing();
        }

        #region Unused DAO methods

        public Order GetById(long id, bool shouldLock) {
            throw new System.Exception("The method or operation is not implemented.");
        }

        public System.Collections.Generic.List<Order> GetAll() {
            throw new System.Exception("The method or operation is not implemented.");
        }

        public Order GetUniqueByExample(Order exampleInstance, params string[] propertiesToExclude) {
            throw new System.Exception("The method or operation is not implemented.");
        }

        public Order Save(Order entity) {
            throw new System.Exception("The method or operation is not implemented.");
        }

        public Order SaveOrUpdate(Order entity) {
            throw new System.Exception("The method or operation is not implemented.");
        }

        public void Delete(Order entity) {
            throw new System.Exception("The method or operation is not implemented.");
        }

        public void CommitChanges() {
            throw new System.Exception("The method or operation is not implemented.");
        }

        #endregion

        private List<Order> CreateOrderListing() {
            List<Order> orderListing = new List<Order>();
            orderListing.Add(order1);
            orderListing.Add(order2);
            orderListing.Add(order3);
            return orderListing;
        }

        private Customer orderingCustomer {
            get {
                Customer orderingCustomer = new Customer("Acme Anvils");
                orderingCustomer.ID = "ACME";
                return orderingCustomer;
            }
        }

        private Customer someOtherCustomer {
            get {
                Customer someOtherCustomer = new Customer("Chow Mein, Inc.");
                someOtherCustomer.ID = "MEIN";
                return someOtherCustomer;
            }
        }

        private Order order1 {
            get {
                Order order = new Order(orderingCustomer);
                order.OrderDate = DateTime.Parse("1/11/2005");
                return order;
            }
        }

        private Order order2 {
            get {
                Order order = new Order(someOtherCustomer);
                order.OrderDate = DateTime.Parse("1/11/2005");
                return order;
            }
        }

        private Order order3 {
            get {
                Order order = new Order(orderingCustomer);
                order.OrderDate = DateTime.Parse("1/11/2005");
                return order;
            }
        }

    }
}
