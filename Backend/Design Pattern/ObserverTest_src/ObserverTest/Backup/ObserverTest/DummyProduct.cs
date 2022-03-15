using System;
using System.Collections.Generic;
using System.Text;

namespace ObserverTest
{
    class DummyProduct : ASubject
    {
        public void ChangePrice(float price)
        {
            Notify(price);
        }
    }
}
