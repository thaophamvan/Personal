using System;
using System.Text;
using System.Reflection;
using NUnit.Framework;
using MVCSharp.Core.Configuration.Tasks;

namespace MVCSharp.Tests.Core.Configuration.Tasks
{
    [TestFixture]
    public class TestTaskInfoByXmlAttributeProvider
    {
        private TaskInfoByXmlAttributeProvider tskInfPrvdr = new TaskInfoByXmlAttributeProvider();

        [Test]
        public void TestGetTaskInfo_Basics()
        {
            TaskInfo ti = tskInfPrvdr.GetTaskInfo(typeof(StubTask1));

            Assert.AreEqual(3, ti.InteractionPoints.Count);
            foreach (string num in new string[] { "1", "2", "3" })
                Assert.AreEqual("View" + num, ti.InteractionPoints["View" + num].ViewName);
            Assert.AreEqual(typeof(StubController1), ti.InteractionPoints["View1"].ControllerType);
            Assert.AreEqual(2, ti.InteractionPoints["View1"].NavTargets.Count);
            Assert.AreEqual(1, ti.InteractionPoints["View3"].NavTargets.Count);
            Assert.AreEqual(ti.InteractionPoints["View2"], ti.InteractionPoints["View1"].NavTargets["To View2"]);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View1"].NavTargets["View3"]);
        }

        [Test]
        public void TestGetTaskInfo_AdjacentPoints()
        {
            TaskInfo ti = tskInfPrvdr.GetTaskInfo(typeof(StubTask2));

            Assert.AreEqual(2, ti.InteractionPoints["View1"].NavTargets.Count);
            Assert.AreEqual(ti.InteractionPoints["View2"], ti.InteractionPoints["View1"].NavTargets["View2"]);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View1"].NavTargets["View3"]);
            Assert.AreEqual(2, ti.InteractionPoints["View2"].NavTargets.Count);
            Assert.AreEqual(ti.InteractionPoints["View1"], ti.InteractionPoints["View2"].NavTargets["View1"]);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View2"].NavTargets["View3"]);
            Assert.AreEqual(3, ti.InteractionPoints["View3"].NavTargets.Count);
            Assert.AreEqual(ti.InteractionPoints["View4"], ti.InteractionPoints["View3"].NavTargets["View4"]);
            Assert.AreEqual(1, ti.InteractionPoints["View4"].NavTargets.Count);
            Assert.AreEqual(ti.InteractionPoints["View3"], ti.InteractionPoints["View4"].NavTargets["View3"]);
        }

        [Test]
        public void TestGetTaskInfo_CommonTargets()
        {
            TaskInfo ti = tskInfPrvdr.GetTaskInfo(typeof(StubTask3));

            Assert.IsTrue(ti.InteractionPoints["View1"].IsCommonTarget);
            Assert.IsFalse(ti.InteractionPoints["View2"].IsCommonTarget);
            Assert.IsFalse(ti.InteractionPoints["View3"].IsCommonTarget);
        }

        [Task(@"
            <interactionPoints>
                <interactionPoint view = ""View1"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController1"">
                    <navTarget trigger = ""To View2"" view = ""View2""/>
                    <navTarget view = ""View3""/>
                </interactionPoint>
                <iPoint view = ""View2"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController2"">
                </iPoint>
                <interactionPoint view = ""View3"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController3"">
                    <navTarget trigger = ""To View2"" view = ""View2""/>
                </interactionPoint>
            </interactionPoints>
        ")]
        class StubTask1 { }

        [Task(@"
            <interactionPoints>
                <interactionPoint view = ""View1"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController1"">
                    <navTarget trigger = ""View2"" view = ""View3""/>
                </interactionPoint>
                <iPoint view = ""View2"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController2""/>
                <iPoint view = ""View3"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController3""/>
                <interactionPoint view = ""View4"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController3""/>
            </interactionPoints>
            <adjacentPoints>
                <iPointRef view = ""View1""/>
                <interactionPointRef view = ""View2""/>
                <iPointRef view = ""View3""/>
            </adjacentPoints>
            <adjacentPoints>
                <iPointRef view = ""View2""/>
                <interactionPointRef view = ""View3""/>
            </adjacentPoints>
            <adjacentPoints>
                <iPointRef view = ""View3""/>
                <iPointRef view = ""View4""/>
            </adjacentPoints>
        ")]
        class StubTask2 { }

        [Task(@"
            <interactionPoints>
                <interactionPoint view = ""View1"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController1""
                                  isCommonTarget = ""true"" />
                <interactionPoint view = ""View2"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController2""
                                  isCommonTarget = ""false"" />
                <interactionPoint view = ""View3"" controllerType = ""MVCSharp.Tests.Core.Configuration.Tasks.StubController3""/>
            </interactionPoints>
        ")]
        class StubTask3 { }
    }

    class StubController1 { }

    class StubController2 { }

    class StubController3 { }
}
