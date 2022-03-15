using System;
using System.Collections.Generic;
using MvpSample.Core.DataInterfaces;
using MvpSample.Core.Domain;
using MvpSample.Data;

namespace MvpSample.Tests.MockDao
{
    /// <summary>
    /// Mock DAO that can be used in place of <see cref="NHibernateDaoFactory.CustomerDaoNHibernate" /> 
    /// to simulate communications with the DB without actually talking to the DB.
    /// </summary>
    public class MockCustomerDao : IGenericDao<Customer, string>, ICustomerDao
    {
        public Customer GetById(string id, bool shouldLock) {
            if (id == null) throw new ArgumentNullException("id may not be null");
            
            Customer customerToReturn = customer1;
            customerToReturn.ID = id;
            return customerToReturn;
        }

        public List<Customer> GetAll() {
            List<Customer> allCustomers = new List<Customer>();
            allCustomers.Add(customer1);
            allCustomers.Add(customer2);
            allCustomers.Add(customer3);
            return allCustomers;
        }

        #region Unused methods

        public List<Customer> GetByExample(Customer exampleInstance, params string[] propertiesToExclude) {
            throw new NotImplementedException();
        }

        public Customer GetUniqueByExample(Customer exampleInstance, params string[] propertiesToExclude) {
            throw new NotImplementedException();
        }

        public Customer Save(Customer entity) {
            throw new NotImplementedException();
        }

        public Customer SaveOrUpdate(Customer entity) {
            throw new NotImplementedException();
        }

        public void Delete(Customer entity) {
            throw new NotImplementedException();
        }

        public void CommitChanges() {
            throw new NotImplementedException();
        }

        #endregion

        private Customer customer1 {
            get {
                Customer customer = new Customer("Acme Anvils");
                customer.ID = "ACME";
                return customer;
            }
        }

        private Customer customer2 {
            get {
                Customer customer = new Customer("And what not");
                customer.ID = "AWN";
                return customer;
            }
        }

        private Customer customer3 {
            get {
                Customer customer = new Customer("Blahbity Blah");
                customer.ID = "BLAH";
                return customer;
            }
        }
    }
}
