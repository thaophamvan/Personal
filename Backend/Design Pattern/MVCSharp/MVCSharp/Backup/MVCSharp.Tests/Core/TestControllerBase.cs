using System;
using System.Text;
using NUnit.Framework;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Views;
using MVCSharp.Core;

namespace MVCSharp.Tests.Core.Tasks
{
    [TestFixture]
    public class TestControllerBase
    {
        [Test]
        public void TestMembersVirtuality()
        {
            Assert.IsTrue(true); // Just ensure that the below definition with overrides
                                 // gets compiled. If so, then the test is passed.
        }

        class SubController : ControllerBase
        {
            public override ITask Task
            {
                get { return null; }
                set { }
            }

            public override IView View
            {
                get { return null; }
                set { }
            }
        }
    }
}
