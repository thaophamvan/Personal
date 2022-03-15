using System;
using System.Collections.Generic;
using System.Text;

namespace ObserverTest
{
    class Program
    {
        static void Main(string[] args)
        {
            DummyProduct product = new DummyProduct();
                        
            // We have four shops wanting to keep updated price set by product owner
            Shop shop1 = new Shop("Shop 1");
            Shop shop2 = new Shop("Shop 2");
            
            Shop shop3 = new Shop("Shop 3");
            Shop shop4 = new Shop("Shop 4");

            //Lets use WAY_1 for first two shops
            product.Attach(shop1);
            product.Attach(shop2);

            //Lets use WAY_2 for other two shops
            product.Attach2(shop3);
            product.Attach2(shop4);

            //Now lets try chaging the products price, this should update the shops automatically
            product.ChangePrice(23.0f);

            //Now shop2 and shop 4 are not interested in new prices so they unsubscribe
            product.Detach(shop2);
            product.Detach2(shop4);

            //Now lets try changing the products price again
            product.ChangePrice(26.0f);

            Console.Read();

        }
    }
}
