using System;
using System.Text;
using NUnit.Framework;
using MVCSharp.Core.Tasks;
using MVCSharp.Core;

namespace MVCSharp.Tests.Core.Tasks
{
    [TestFixture]
    public class TestTaskBase
    {
        [Test]
        public void TestMembersVirtuality()
        {
            Assert.IsTrue(true); // Just ensure that the below definition with overrides
                                 // gets compiled. If so, then the test is passed.
        }

        class SubTask : TaskBase
        {
            public override void OnStart(object param)
            { }

            public override Navigator Navigator
            {
                get { return null; }
                set { }
            }

            public override TasksManager TasksManager
            {
                get { return null; }
                set { }
            }

            public override string CurrViewName
            {
                get { return null; }
                set { }
            }
        }
    }
}
