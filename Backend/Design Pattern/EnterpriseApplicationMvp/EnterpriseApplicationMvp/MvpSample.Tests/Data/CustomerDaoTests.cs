using System;
using System.Collections.Generic;
using MvpSample.Core.DataInterfaces;
using MvpSample.Core.Domain;
using MvpSample.Data;
using NUnit.Framework;

namespace MvpSample.Tests.Data
{
    [TestFixture]
    [Category("NHibernate Tests")]
    public class CustomerDaoTests
    {
        /// <summary>
        /// Initializes the NHibernate session bound to HttpContext.
        /// This TestFixtureSetUp could be moved to a NHibernateUnitTest class so you don't have to 
        /// copy/past it into every unit test class.
        /// </summary>
        [TestFixtureSetUp]
        public void Setup() {
            NHibernateSessionManager.Instance.BeginTransaction();
        }

        [Test]
        public void TestGetById() {
            IDaoFactory daoFactory = new NHibernateDaoFactory();
            ICustomerDao customerDao = daoFactory.GetCustomerDao();

            Customer foundCustomer = customerDao.GetById("CHOPS", false);
            Assert.AreEqual("Chop-suey Chinese", foundCustomer.CompanyName);
        }

        [Test]
        public void TestGetOrdersShippedTo() {
            IDaoFactory daoFactory = new NHibernateDaoFactory();
            ICustomerDao customerDao = daoFactory.GetCustomerDao();

            Customer customer = customerDao.GetById("CHOPS", false);
            customer.OrderDao = daoFactory.GetOrderDao();
            IList<Order> ordersMatchingDate = customer.GetOrdersOrderedOn(DateTime.Parse("11/19/1997"));

            Assert.AreEqual(1, ordersMatchingDate.Count);
            Assert.AreEqual(10746, ordersMatchingDate[0].ID);
        }

        /// <summary>
        /// Properly disposes of the <see cref="NHibernateSessionManager"/>.
        /// This always rolls back the transaction - changes never get committed.
        /// This TestFixtureTearDown could be moved to a NHibernateUnitTest class so you don't have to 
        /// copy/past it into every unit test class.
        /// </summary>
        [TestFixtureTearDown]
        public void Dispose() {
            NHibernateSessionManager.Instance.RollbackTransaction();
        }
    }
}
