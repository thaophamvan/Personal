using System;
using System.Text;
using System.Reflection;
using NUnit.Framework;
using MVCSharp.Core.Configuration;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Core.Configuration.Views;

namespace MVCSharp.Tests.Core.Configuration.Tasks
{
    [TestFixture]
    public class TestTaskInfoCollection
    {
        private MVCConfiguration mvcConfig = new MVCConfiguration();

        [TestFixtureSetUp]
        public void FixtureSetUp()
        {
            mvcConfig.TaskInfoProvider = new StubTaskInfoProvider();
            mvcConfig.ViewInfosProviderType = typeof(StubViewInfosProvider);
        }

        [Test]
        public void TestIndexer()
        {
            TaskInfoCollection taskInfColl = new TaskInfoCollection();
            taskInfColl.MVCConfig = mvcConfig;

            TaskInfo ti = taskInfColl[typeof(StubTask)];
            Assert.AreSame(StubTaskInfoProvider.returnedObj, ti);
            Assert.AreSame(StubViewInfosProvider.returnedViewInfoColl, ti.ViewInfos);
        }

        #region Stubs implementations

        class StubTask
        { }

        class StubTaskInfoProvider : ITaskInfoProvider
        {
            public static readonly TaskInfo returnedObj = new TaskInfo();

            public TaskInfo GetTaskInfo(Type taskType)
            {
                return returnedObj;
            }
        }

        class StubViewInfosProvider : IViewInfosProvider
        {
            public static readonly ViewInfoCollection returnedViewInfoColl = new ViewInfoCollection();

            public ViewInfosByTaskCollection GetFromAssembly(Assembly assembly)
            {
                ViewInfosByTaskCollection result = new ViewInfosByTaskCollection();
                result[typeof(StubTask)] = returnedViewInfoColl;
                return result;
            }
        }

        #endregion
    }
}
