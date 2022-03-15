using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;

namespace ObserverTest
{
    abstract class ASubject
    {
        //This is the one way we can implement ir, lets call it WAY_1
        ArrayList list = new ArrayList();
        
        //This is another way we can implement observer, lets call it WAY_2
        public delegate void StatusUpdate(float price);
        public event StatusUpdate OnStatusUpdate = null;
        
        public void Attach(Shop product)
        {
            //For way 1 lets assign attach the observers with subjects
            list.Add(product);
        }
        public void Detach(Shop product)
        {
            //For way 1 lets assign detach the observers with subjects
            list.Remove(product);           
        }

        public void Attach2(Shop product)
        {
            //For way 2 lets assign attach the observers with subjects
            OnStatusUpdate += new StatusUpdate(product.Update);
        }
        public void Detach2(Shop product)
        {
            //For way 2 lets assign detach the observers with subjects
            OnStatusUpdate -= new StatusUpdate(product.Update);
        }

        public void Notify(float price)
        {
            //For way 1 lets notify the observers with change
            foreach (Shop p in list)
            {
                p.Update(price);
            }

            //For way 2 lets notify the observers with change
            if (OnStatusUpdate != null)
            {
                OnStatusUpdate(price);
            }
        }
    }
}
