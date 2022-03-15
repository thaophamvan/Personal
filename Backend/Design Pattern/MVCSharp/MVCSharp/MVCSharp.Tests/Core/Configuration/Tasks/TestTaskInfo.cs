using System;
using System.Text;
using NUnit.Framework;
using MVCSharp.Core.Configuration.Tasks;

namespace MVCSharp.Tests.Core.Configuration.Tasks
{
    [TestFixture]
    public class TestTaskInfo
    {
        private InteractionPointInfo iPointInf1 = new InteractionPointInfo();
        private InteractionPointInfo iPointInf2 = new InteractionPointInfo();

        private TaskInfo taskInfo = new TaskInfo();

        [TestFixtureSetUp]
        public void FixtureSetUp()
        {
            iPointInf1.ViewName = "View1";
            iPointInf2.ViewName = "View2";

            taskInfo.InteractionPoints["View1"] = iPointInf1;
            taskInfo.InteractionPoints["View2"] = iPointInf2;

            iPointInf1.NavTargets["To View2"] = iPointInf2;
            iPointInf1.IsCommonTarget = true;
        }

        [Test]
        public void TestGetNextViewName()
        {
            Assert.AreEqual("View2", taskInfo.GetNextViewName("View1", "To View2"));
            Assert.AreEqual("View1", taskInfo.GetNextViewName("View2", "View1"));
            Assert.IsNull(taskInfo.GetNextViewName("View1", "Wrong trigger"));
        }

        [Test]
        public void TestCanNavigateToView()
        {
            Assert.IsTrue(taskInfo.CanNavigateToView("View1", "View2"));
            Assert.IsTrue(taskInfo.CanNavigateToView("View2", "View1"));
            Assert.IsFalse(taskInfo.CanNavigateToView("View1", "View3"));
        }
    }
}
