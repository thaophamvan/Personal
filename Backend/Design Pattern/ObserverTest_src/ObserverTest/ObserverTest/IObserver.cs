using System;
using System.Collections.Generic;
using System.Text;

namespace ObserverTest
{
    interface IObserver
    {
        void Update(float price);
    }
}
