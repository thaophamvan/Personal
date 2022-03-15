using System;
using System.Collections.Generic;
using System.Text;
using NUnit.Framework;
using MvpSample.Core.Domain;
using MvpSample.Core.DataInterfaces;
using MvpSample.Tests.MockDao;

namespace MvpSample.Tests.Domain
{
    [TestFixture]
    public class CustomerTests
    {
        [Test]
        public void TestCustomerOrderRelationship() {
            Customer customer = new Customer("Acme Anvil");
            Order order = new Order(customer);
            Assert.AreEqual(customer, order.OrderedBy);

            customer.Orders.Clear();
            // Removing the orders from the customer should automatically 
            // remove the customer from the order
            Assert.AreEqual(null, order.OrderedBy);

            order.OrderedBy = customer;
            // Adding the customer to the order should automatically 
            // add the order to the customer's order collection
            Assert.IsTrue(customer.Orders.Contains(order));
        }

        [Test]
        public void TestGetOrdersOrderedOn() {
            Customer customer = new Customer("Acme Anvils");
            customer.ID = "ACME";
            customer.OrderDao = new MockOrderDao();

            List<Order> matchingOrders = customer.GetOrdersOrderedOn(DateTime.Parse("1/11/2005"));
            Assert.AreEqual(2, matchingOrders.Count);
        }
    }
}
