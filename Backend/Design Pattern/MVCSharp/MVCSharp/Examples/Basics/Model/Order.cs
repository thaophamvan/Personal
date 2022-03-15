using System;

namespace MVCSharp.Examples.Basics.Model
{
    public class Order
    {
        private OrderState state = OrderState.Open;
        
        public OrderState State
        {
            get { return state; }
        }

        public void Accept()
        {
            if (State == OrderState.Open)
                state = OrderState.Pending;
        }

        public void Ship()
        {
            if (State == OrderState.Pending)
                state = OrderState.Shipped;
        }

        public void Cancel()
        {
            if (State != OrderState.Shipped)
                state = OrderState.Cancelled;
        }
    }
}
