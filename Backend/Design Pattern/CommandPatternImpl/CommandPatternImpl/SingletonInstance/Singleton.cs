using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SingletonInstance
{
    public sealed class Singleton
    {

        static readonly Singleton instance = new Singleton();

        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static Singleton()
        {
        }
        private Singleton()
        {
        }
        public static Singleton Instance
        {
            get
            {
                return instance;
            }

        }
        public void TestMethod(int routeNum)
        {
            Console.WriteLine("Bus #{0} is created.", routeNum);
        }
        public void TestMethodSecond(int routeNum)
        {
            Console.WriteLine("Bus #{0} is created.", routeNum);
        }
        public void TestMethodStatic(int routeNum)
        {
            Console.WriteLine("Bus #{0} is created.", routeNum);
        }

    }
}
