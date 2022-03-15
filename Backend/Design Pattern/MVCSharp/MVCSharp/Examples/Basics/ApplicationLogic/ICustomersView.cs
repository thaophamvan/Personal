using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Examples.Basics.Model;

namespace MVCSharp.Examples.Basics.ApplicationLogic
{
    public interface ICustomersView
    {
        void SetCustomersList(List<Customer> customers);

        Customer CurrentCustomer
        {
            get;
            set;
        }
    }
}
