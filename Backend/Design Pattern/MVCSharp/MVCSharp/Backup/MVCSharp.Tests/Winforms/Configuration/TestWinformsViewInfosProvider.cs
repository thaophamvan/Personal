using System;
using System.Text;
using System.Reflection;
using NUnit.Framework;
using MVCSharp.Core.Configuration.Views;
using MVCSharp.Winforms.Configuration;

namespace MVCSharp.Tests.Winforms.Configuration
{
    [TestFixture]
    public class TestWinformsViewInfosProvider
    {
        IViewInfosProvider viewInfsProvider = new WinformsViewInfosProvider();

        WinformsViewInfo view1Info;
        WinformsViewInfo view2Info;
        WinformsViewInfo view3Info;
        WinformsViewInfo view4Info;
        WinformsViewInfo view5Info;

        [TestFixtureSetUp]
        public void FixtureSetUp()
        {
            ViewInfosByTaskCollection viewInfsByTask = viewInfsProvider.GetFromAssembly(
                                             Assembly.GetExecutingAssembly());
            view1Info = viewInfsByTask[typeof(int)]["View1"] as WinformsViewInfo;
            view2Info = viewInfsByTask[typeof(int)]["View2"] as WinformsViewInfo;
            view3Info = viewInfsByTask[typeof(string)]["View3"] as WinformsViewInfo;
            view4Info = viewInfsByTask[typeof(int)]["View4"] as WinformsViewInfo;
            view5Info = viewInfsByTask[typeof(int)]["View5"] as WinformsViewInfo;
        }

        [Test]
        public void TestGetFromAssembly()
        {
            Assert.AreEqual(typeof(View1), view1Info.ViewType);
            Assert.IsTrue(view1Info.IsMdiParent);
            Assert.IsNull(view1Info.MdiParent);

            Assert.IsFalse(view2Info.IsMdiParent);
            Assert.AreEqual("View1", view2Info.MdiParent);
            Assert.IsFalse(view2Info.ShowModal);

            Assert.IsTrue(view3Info.ShowModal);

            Assert.AreEqual(typeof(View4), view4Info.ViewType);
            Assert.AreEqual(typeof(View4), view5Info.ViewType);
        }
    }

    [WinformsView(typeof(int), "View1", IsMdiParent = true)]
    [WinformsView(typeof(int), "View2", MdiParent = "View1")]
    public class View1 { }

    [WinformsView(TaskType = typeof(string), ViewName = "View3", ShowModal = true)]
    public class View3 { }

    [View(typeof(int), "View4")]
    [View(typeof(int), "View5")]
    public class View4 { }
}
