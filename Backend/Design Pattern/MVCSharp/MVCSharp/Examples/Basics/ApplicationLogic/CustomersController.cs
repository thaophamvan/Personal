using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;
using MVCSharp.Core.Views;
using MVCSharp.Examples.Basics.Model;

namespace MVCSharp.Examples.Basics.ApplicationLogic
{
    public class CustomersController : ControllerBase
    {
        public override IView View
        {
            get { return base.View; }
            set
            {
                base.View = value;
                (View as ICustomersView).SetCustomersList(Customer.AllCustomers);
                (View as ICustomersView).CurrentCustomer =
                                        (Task as MainTask).CurrentCustomer;
            }
        }

        public void ShowOrders()
        {
            Task.Navigator.Navigate(MainTask.Orders);
        }

        public void CurrentCustomerChanged()
        {
            (Task as MainTask).CurrentCustomer =
                              (View as ICustomersView).CurrentCustomer;
        }
    }
}
