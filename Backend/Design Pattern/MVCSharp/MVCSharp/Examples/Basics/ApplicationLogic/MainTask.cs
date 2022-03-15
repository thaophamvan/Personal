using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Core.Tasks;
using MVCSharp.Examples.Basics.Model;

namespace MVCSharp.Examples.Basics.ApplicationLogic
{
    public class MainTask : TaskBase
    {
        [InteractionPoint(typeof(CustomersController), Orders)]
        public const string Customers = "Customers";

        [InteractionPoint(typeof(OrdersController), Customers)]
        public const string Orders = "Orders";

        private Customer currentCustomer = Customer.AllCustomers[0];

        public event EventHandler CurrentCustomerChanged;

        public Customer CurrentCustomer
        {
            get { return currentCustomer; }
            set
            {
                currentCustomer = value;
                if (CurrentCustomerChanged != null)
                    CurrentCustomerChanged(this, EventArgs.Empty);
            }
        }

        public override void OnStart(object param)
        {
            Navigator.NavigateDirectly(Customers);
        }
    }
}
