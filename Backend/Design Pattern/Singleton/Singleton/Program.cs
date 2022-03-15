using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Singleton
{
    class Program
    {
        static void Main(string[] args)
        {
        }
        //First version - not thread-safe
        // Bad code! Do not use!
        public sealed class Singleton
        {
            private static Singleton instance = null;

            private Singleton()
            {
            }

            public static Singleton Instance
            {
                get
                {
                    if (instance == null)
                    {
                        instance = new Singleton();
                    }
                    return instance;
                }
            }
        }
        //Second version - simple thread-safety
        public sealed class Singleton2
        {
            private static Singleton2 instance = null;
            private static readonly object padlock = new object();

            Singleton2()
            {
            }

            public static Singleton2 Instance
            {
                get
                {
                    lock (padlock)
                    {
                        if (instance == null)
                        {
                            instance = new Singleton2();
                        }
                        return instance;
                    }
                }
            }
        }
        //Third version - attempted thread-safety using double-check locking
        // Bad code! Do not use!
        public sealed class Singleton3
        {
            private static Singleton3 instance = null;
            private static readonly object padlock = new object();

            Singleton3()
            {
            }

            public static Singleton3 Instance
            {
                get
                {
                    if (instance == null)
                    {
                        lock (padlock)
                        {
                            if (instance == null)
                            {
                                instance = new Singleton3();
                            }
                        }
                    }
                    return instance;
                }
            }
        }
        //Fourth version - not quite as lazy, but thread-safe without using locks
        public sealed class Singleton4
        {
            private static readonly Singleton4 instance = new Singleton4();

            // Explicit static constructor to tell C# compiler
            // not to mark type as beforefieldinit
            static Singleton4()
            {
            }

            private Singleton4()
            {
            }

            public static Singleton4 Instance
            {
                get
                {
                    return instance;
                }
            }
        }
        //Fifth version - fully lazy instantiation
        public sealed class Singleton5
        {
            private Singleton5()
            {
            }

            public static Singleton5 Instance { get { return Nested.instance; } }

            private class Nested
            {
                // Explicit static constructor to tell C# compiler
                // not to mark type as beforefieldinit
                static Nested()
                {
                }

                internal static readonly Singleton5 instance = new Singleton5();
            }
        }
    }
}
