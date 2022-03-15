using System;
using System.Text;
using NUnit.Framework;
using MVCSharp.Core.Configuration.Tasks;

namespace MVCSharp.Tests.Core.Configuration.Tasks
{
    [TestFixture]
    public class TestTaskInfoByAttributesProvider
    {
        private TaskInfoByAttributesProvider tskInfPrvdr = new TaskInfoByAttributesProvider();

        [Test]
        public void TestGetTaskInfo_Basics()
        {
            TaskInfo ti = tskInfPrvdr.GetTaskInfo(typeof(StubTask1));

            Assert.AreEqual(4, ti.InteractionPoints.Count);
            foreach (string num in new string[] { "1", "2", "3" })
                Assert.AreEqual("View" + num, ti.InteractionPoints["View" + num].ViewName);
            Assert.AreEqual(typeof(StubController1), ti.InteractionPoints["View1"].ControllerType);
            Assert.AreEqual(typeof(StubController2), ti.InteractionPoints["View2"].ControllerType);

            Assert.AreEqual(0, ti.InteractionPoints["View1"].NavTargets.Count);
            Assert.AreEqual(1, ti.InteractionPoints["View2"].NavTargets.Count);
            Assert.AreEqual(2, ti.InteractionPoints["View3"].NavTargets.Count);
            Assert.AreEqual(2, ti.InteractionPoints["View4"].NavTargets.Count);

            Assert.AreEqual(ti.InteractionPoints["View1"], ti.InteractionPoints["View3"].NavTargets["View1"]);
            Assert.AreEqual(ti.InteractionPoints["View2"], ti.InteractionPoints["View3"].NavTargets["View2"]);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View4"].NavTargets["Next"]);
            Assert.AreEqual(ti.InteractionPoints["View2"], ti.InteractionPoints["View4"].NavTargets["Previous"]);
        }

        [Test]
        public void TestGetTaskInfo_CommonTargets()
        {
            TaskInfo ti = tskInfPrvdr.GetTaskInfo(typeof(StubTask1));

            Assert.IsFalse(ti.InteractionPoints[StubTask1.iPoint1].IsCommonTarget);
            Assert.IsTrue(ti.InteractionPoints[StubTask1.iPoint2].IsCommonTarget);
            Assert.IsFalse(ti.InteractionPoints[StubTask1.iPoint3].IsCommonTarget);
            Assert.IsTrue(ti.InteractionPoints[StubTask1.iPoint4].IsCommonTarget);
        }

        [Test]
        public void TestGetTaskInfo_AdjacentPoints()
        {
            TaskInfo ti = tskInfPrvdr.GetTaskInfo(typeof(StubTask2));

            Assert.AreEqual(3, ti.InteractionPoints["View1"].NavTargets.Count);
            Assert.AreEqual(3, ti.InteractionPoints["View2"].NavTargets.Count);
            Assert.AreEqual(2, ti.InteractionPoints["View3"].NavTargets.Count);
            Assert.AreEqual(3, ti.InteractionPoints["View4"].NavTargets.Count);
            Assert.AreEqual(1, ti.InteractionPoints["View5"].NavTargets.Count);
            Assert.AreEqual(ti.InteractionPoints["View2"], ti.InteractionPoints["View1"].NavTargets["View2"]);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View1"].NavTargets["View3"]);
            Assert.AreEqual(ti.InteractionPoints["View1"], ti.InteractionPoints["View2"].NavTargets["View1"]);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View2"].NavTargets["View3"]);
            Assert.AreEqual(ti.InteractionPoints["View1"], ti.InteractionPoints["View3"].NavTargets["View1"]);
            Assert.AreEqual(ti.InteractionPoints["View2"], ti.InteractionPoints["View3"].NavTargets["View2"]);
            Assert.AreEqual(ti.InteractionPoints["View4"], ti.InteractionPoints["View5"].NavTargets["View4"]);
        }

        class StubTask1
        {
            [InteractionPoint(typeof(StubController1))]
            public const string iPoint1 = "View1";

            [IPoint(typeof(StubController2), true, iPoint1)]
            public const string iPoint2 = "View2";

            [InteractionPoint(typeof(StubController1), iPoint1, iPoint2)]
            public const string iPoint3 = "View3";

            [InteractionPoint(typeof(StubController1), true)]
            [NavTarget("Next", iPoint3)]
            [NavTarget("Previous", iPoint2)]
            public const string iPoint4 = "View4";

            [InteractionPoint(typeof(StubController1))]
            private const string wrongFormatPoint1 = "wrongFormatPoint1";
            [InteractionPoint(typeof(StubController1))]
            public const int wrongFormatPoint2 = 2;
            [InteractionPoint(typeof(StubController1))]
            public static readonly string wrongFormatPoint3 = "wrongFormatPoint3";
        }

        [AdjacentPoints(View1, View2, View3)]
        [AdjacentPoints(View1, View2, View4)]
        [AdjacentPoints(View4, View5)]
        class StubTask2
        {
            [InteractionPoint(typeof(StubController1))]
            public const string View1 = "View1";

            [InteractionPoint(typeof(StubController1))]
            [NavTarget(View1, View5)]
            public const string View2 = "View2";

            [InteractionPoint(typeof(StubController1))]
            public const string View3 = "View3";

            [InteractionPoint(typeof(StubController1))]
            public const string View4 = "View4";

            [InteractionPoint(typeof(StubController1))]
            public const string View5 = "View5";
        }

        class StubController1 {}
        class StubController2 { }
    }
}
