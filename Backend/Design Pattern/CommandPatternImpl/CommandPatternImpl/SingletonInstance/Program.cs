using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SingletonInstance
{
    class Program
    {
        static void Main(string[] args)
        {
            Singleton.Instance.TestMethod(1);
            Singleton.Instance.TestMethodSecond(2);
            Singleton.Instance.TestMethodStatic(3);
        }
    }
}
