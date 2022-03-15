using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;
using MVCSharp.Core.Tasks;
using MVCSharp.Examples.Basics.Model;
using MVCSharp.Core.Views;

namespace MVCSharp.Examples.Basics.ApplicationLogic
{
    public class OrdersController : ControllerBase
    {
        public override ITask Task
        {
            get { return base.Task; }
            set
            {
                base.Task = value;
                (Task as MainTask).CurrentCustomerChanged += CurrentCustomerChanged;
            }
        }

        public override IView View
        {
            get {return base.View; }
            set
            {
                base.View = value;
                CurrentCustomerChanged(Task, EventArgs.Empty);
            }
        } 

        private void CurrentCustomerChanged(object sender, EventArgs e)
        {
            (View as IOrdersView).SetOrdersList((Task as MainTask).CurrentCustomer.Orders);
            UpdateView();
        }

        public void AcceptOrder()
        {
            (View as IOrdersView).CurrentOrder.Accept();
            UpdateView();
        }

        public void ShipOrder()
        {
            (View as IOrdersView).CurrentOrder.Ship();
            UpdateView();
        }

        public void CancelOrder()
        {
            (View as IOrdersView).CurrentOrder.Cancel();
            UpdateView();
        }

        public void CurrentOrderChanged()
        {
            UpdateView();
        }

        private void UpdateView()
        {
            if ((View as IOrdersView).CurrentOrder == null) return;
            OrderState os = (View as IOrdersView).CurrentOrder.State;
            (View as IOrdersView).SetOperationsEnabling(
                             os == OrderState.Open, os == OrderState.Pending,
                            (os == OrderState.Open) || (os == OrderState.Pending));
        }

        public void ShowCustomers()
        {
            Task.Navigator.Navigate(MainTask.Customers);
        }
    }
}
