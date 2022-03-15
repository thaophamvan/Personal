using System;
using System.Collections.Generic;
using System.Text;

namespace ObserverTest
{
    class Shop : IObserver
    {
        //Name if the product
        string name;
        float price = 0.0f; //default

        public Shop(string name)
        {
            this.name = name;
        }
        #region IObserver Members

        public void Update(float price)
        {
            this.price = price;

            //Lets print on console just to test the working
            Console.WriteLine(@"Price at {0} is now {1}", name, price);
        }

        #endregion
    }
}
