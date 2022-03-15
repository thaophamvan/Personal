using System;
using System.Text;
using System.Reflection;
using NUnit.Framework;
using MVCSharp.Core.Configuration.Views;

namespace MVCSharp.Tests.Core.Configuration.Views
{
    [TestFixture]
    public class TestDefaultViewInfosProvider
    {
        [Test]
        public void TestGetFromAssembly()
        {
            IViewInfosProvider viewInfsProvider = new DefaultViewInfosProvider();
            ViewInfosByTaskCollection viewInfsByTask = viewInfsProvider.GetFromAssembly(
                                                         Assembly.GetExecutingAssembly());
            Assert.AreSame(typeof(View1), viewInfsByTask[typeof(int)]["View 1"].ViewType);
            Assert.AreSame(typeof(View2), viewInfsByTask[typeof(int)]["View 2"].ViewType);
            Assert.AreSame(typeof(View3), viewInfsByTask[typeof(string)]["View 1"].ViewType);
        }
    }

    [View(TaskType = typeof(int), ViewName = "View 1")]
    public class View1 { }

    [View(typeof(int), "View 2")]
    public class View2 { }

    [View(TaskType = typeof(string), ViewName = "View 1")]
    public class View3 { }

    public class View4 : View1 { }
}
