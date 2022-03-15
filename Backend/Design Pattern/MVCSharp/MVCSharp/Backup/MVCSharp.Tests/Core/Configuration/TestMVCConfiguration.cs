using System;
using System.Text;
using System.Reflection;
using NUnit.Framework;
using MVCSharp.Core.Configuration;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Core.Configuration.Views;

namespace MVCSharp.Tests.Core.Configuration
{
    [TestFixture]
    public class TestMVCConfiguration
    {
        private MVCConfiguration mvcConfig;
        
        [SetUp]
        public void TestSetUp()
        {
            mvcConfig = new MVCConfiguration();
        }

        [Test]
        public void TestViewInfosByTask()
        {
            mvcConfig.ViewInfosProviderType = typeof(StubViewInfosProvider);
            Assert.AreSame(StubViewInfosProvider.returnedObj, mvcConfig.ViewInfosByTask);
        }

        [Test]
        public void TestTaskInfoProvider()
        {
            mvcConfig.TaskInfoProviderType = typeof(StubTaskInfoProvider1);
            Assert.IsInstanceOfType(typeof(StubTaskInfoProvider1), mvcConfig.TaskInfoProvider);

            StubTaskInfoProvider taskInfP = new StubTaskInfoProvider();
            mvcConfig.TaskInfoProvider = taskInfP;
            Assert.AreSame(taskInfP, mvcConfig.TaskInfoProvider);

            mvcConfig.TaskInfoProvider = null;
            Assert.IsInstanceOfType(typeof(StubTaskInfoProvider1), mvcConfig.TaskInfoProvider);
        }

        [Test]
        public void TestTaskInfos()
        {
            TaskInfoCollection taskInfos = mvcConfig.TaskInfos;
            Assert.IsNotNull(taskInfos);
            Assert.AreSame(taskInfos.MVCConfig, mvcConfig);
        }

        [Test]
        public void TestGetDefault()
        {
            MVCConfiguration defaultConf = MVCConfiguration.GetDefault();
            Assert.AreEqual(typeof(DefaultTaskInfoProvider), defaultConf.TaskInfoProviderType);
            Assert.AreEqual(typeof(DefaultViewInfosProvider), defaultConf.ViewInfosProviderType);
            Assert.AreEqual(Assembly.GetExecutingAssembly(), defaultConf.ViewsAssembly);
            Assert.AreNotSame(defaultConf, MVCConfiguration.GetDefault());
        }

        #region Stubs implementations

        public class StubViewInfosProvider : IViewInfosProvider
        {
            public static readonly ViewInfosByTaskCollection returnedObj = new ViewInfosByTaskCollection();

            public ViewInfosByTaskCollection GetFromAssembly(Assembly assembly)
            {
                return returnedObj;
            }
        }

        class StubTaskInfoProvider1 : StubTaskInfoProvider
        {}

        class StubTaskInfoProvider : ITaskInfoProvider
        {
            public static readonly TaskInfo returnedObj = new TaskInfo();

            public TaskInfo GetTaskInfo(Type taskType)
            {
                return returnedObj;
            }
        }

        #endregion
    }
}
