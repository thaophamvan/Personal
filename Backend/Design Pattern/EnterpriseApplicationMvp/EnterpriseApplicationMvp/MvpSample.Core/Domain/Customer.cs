using System;
using System.Collections.Generic;
using NHibernate.Generics;
using MvpSample.Core.DataInterfaces;

namespace MvpSample.Core.Domain
{
    public class Customer : DomainObject<string>
    {
        #region Constructors

        /// <summary>
        /// This is a placeholder constructor for NHibernate.
        /// A no-argument constructor must be avilable for NHibernate to create the object.
        /// Be sure to call the "primary" constructor so the collections get wired up correctly.
        /// </summary>
        private Customer() : this("") { }

        /// <summary>
        /// Creates a valid customer.
        /// </summary>
        public Customer(string companyName) {
            // Entities must be wired up correctly before setting property values
            WireUpEntities();

            CompanyName = companyName;
        }

        /// <summary>
        /// Sets up parent/child relationship add/remove scaffolding.  So if a child is 
        /// added to a parent, the parent automatically gets added to the child, and vice versa.
        /// </summary>
        private void WireUpEntities() {
            // Implement parent/child relationship add/remove scaffolding between Customer and Orders
            _orders = new EntityList<Order>(
                delegate(Order order) { order.OrderedBy = this; },
                delegate(Order order) { order.OrderedBy = null; }
                );
        } 

        #endregion

        #region Properties

        /// <summary>
        /// Provides an accessor for injecting an IOrderDao so that this class does 
        /// not have to create one itself.  Can be set from a controller, using 
        /// IoC, or from another business object.
        /// </summary>
        public IOrderDao OrderDao {
            get {
                if (orderDao == null) {
                    throw new MemberAccessException("OrderDao has not yet been initialized");
                }

                return orderDao;
            }
            set {
                orderDao = value;
            }
        }

        public string CompanyName {
            get { return companyName; }
            set {
                if (value == null) {
                    throw new ArgumentNullException("CompanyName cannot be set to null");
                }

                companyName = value;
            }
        }

        public string ContactName {
            get { return contactName; }
            set { contactName = value; }
        }

        public IList<Order> Orders {
            get { return _orders; }
        }
        
        #endregion

        #region Methods

        /// <summary>
        /// To get all the orders ordered on a particular date, we could loop through 
        /// each item in the Orders collection.  But if a customer has thousands of 
        /// orders, we don't want all the orders to have to be loaded from the database.  
        /// Instead, we can let the data layer do the filtering for us.
        /// </summary>
        public List<Order> GetOrdersOrderedOn(DateTime orderedDate) {
            Order exampleOrder = new Order(this);
            exampleOrder.OrderDate = orderedDate;

            // Make sure you use "OrderDao" and not "orderDao" so it'll be checked for proper initialization;
            // otherwise, you may get the oh-so-fun-to-track-down "object reference" exception.
            List<Order> allMatchingOrders = OrderDao.GetByExample(exampleOrder);

            // One downside to "GetByExample" is that the NHibernate "example fetcher" is rather shallow;
            // it'll only match on primitive properties - so even though Order.OrderedBy is set, it won't
            // match on it.  So we have to go through each of the returned results looking for any that
            // were orderd by this customer.  For situations like this, it would be better to expose a 
            // more specialized IOrderDao method, but this'll work for the demonstration at hand.
            List<Order> matchingOrdersForThisCustomer = new List<Order>();

            foreach (Order matchingOrder in allMatchingOrders) {
                if (matchingOrder.OrderedBy.ID == ID) {
                    matchingOrdersForThisCustomer.Add(matchingOrder);
                }
            }

            return matchingOrdersForThisCustomer;
        }

        #endregion


        #region Members

        private IOrderDao orderDao;
        private string companyName = "";
        private string contactName = "";
        // NHibernate.Generics members must be named in the following format:  _camelCase
        private EntityList<Order> _orders;

        #endregion
    }
}
