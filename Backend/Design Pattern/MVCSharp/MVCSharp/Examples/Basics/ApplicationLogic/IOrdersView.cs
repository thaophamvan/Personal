using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Examples.Basics.Model;

namespace MVCSharp.Examples.Basics.ApplicationLogic
{
    public interface IOrdersView
    {
        void SetOrdersList(List<Order> orders);
        
        Order CurrentOrder
        {
            get;
        }

        void SetOperationsEnabling(bool AcceptIsEnabled, bool ShipIsEnabled, bool CancelIsEnabled);
    }
}
