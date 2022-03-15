using System;
using System.Text;
using NUnit.Framework;
using MVCSharp.Core;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Core.Configuration.Views;
using MVCSharp.Core.Views;

namespace MVCSharp.Tests.Core
{
    [TestFixture]
    public class TestNavigator
    {
        private Navigator n = new Navigator();
        private StubTask stubTask = new StubTask();
        private TaskInfo ti = new TaskInfo();
        private InteractionPointInfo ipFirstInf = new InteractionPointInfo();
        private InteractionPointInfo ipSecondInf = new InteractionPointInfo();

        [TestFixtureSetUp]
        public void FixtureSetUp()
        {
            n.Task = stubTask;
            n.TaskInfo = ti;
            n.ViewsManager = new StubViewsManager();
            ti.InteractionPoints["Some View"] = ipFirstInf;
            ti.InteractionPoints["Some Other View"] = ipSecondInf;
            ipFirstInf.ViewName = "Some View";
            ipSecondInf.ViewName = "Some Other View";
            ipFirstInf.ControllerType = typeof(StubFirstController);
            ipSecondInf.ControllerType = typeof(StubSecondController);
            ipFirstInf.NavTargets["Next"] = ipSecondInf;
            ipFirstInf.NavTargets["Self"] = ipFirstInf;
        }

        [SetUp]
        public void SetUp()
        {
            StubViewsManager.viewActivationCount = 0;
            StubViewsManager.lastViewNameActivated = string.Empty;
            stubTask.viewNameIsFixed = false;
            stubTask.CurrViewName = "Some View";
        }

        [Test]
        public void TestNavigate()
        {
            n.Navigate("Next");

            Assert.AreEqual(1, StubViewsManager.viewActivationCount);
            Assert.AreEqual("Some Other View", StubViewsManager.lastViewNameActivated);
            Assert.AreEqual("Some Other View", stubTask.CurrViewName);

            stubTask.CurrViewName = "Some View";
            stubTask.viewNameIsFixed = true;
            n.Navigate("Next");

            Assert.AreEqual(2, StubViewsManager.viewActivationCount);
            Assert.AreEqual("Some View", StubViewsManager.lastViewNameActivated);
        }

        [Test]
        public void TestNavigateToSameView()
        {
            n.Navigate("Self");

            Assert.AreEqual(0, StubViewsManager.viewActivationCount);
        }

        [Test]
        public void TestTryNavigateToView()
        {
            n.TryNavigateToView("Some Other View");

            Assert.AreEqual(1, StubViewsManager.viewActivationCount);
            Assert.AreEqual("Some Other View", stubTask.CurrViewName);
            Assert.AreEqual("Some Other View", StubViewsManager.lastViewNameActivated);

            n.TryNavigateToView("Some View");

            Assert.AreEqual(2, StubViewsManager.viewActivationCount);
            Assert.AreEqual("Some Other View", stubTask.CurrViewName);
            Assert.AreEqual("Some Other View", StubViewsManager.lastViewNameActivated);
        }

        [Test]
        public void TestNavigateDirectly()
        {
            stubTask.CurrViewName = "Some Other View";
            n.NavigateDirectly("Some View");
            
            Assert.AreEqual(1, StubViewsManager.viewActivationCount);
        }

        [Test]
        public void TestGetController()
        {
            IController firstC = n.GetController("Some View");
            IController secondC = n.GetController("Some Other View");
            
            Assert.IsInstanceOfType(typeof(StubFirstController), firstC);
            Assert.IsInstanceOfType(typeof(StubSecondController), secondC);
            Assert.AreSame(stubTask, firstC.Task);
            Assert.AreSame(firstC, n.GetController("Some View"));
        }

        #region Stubs implementations

        class StubTask : ITask
        {
            private Navigator nav;
            private TasksManager tMan;
            private string currViewName;

            public bool viewNameIsFixed;

            public void OnStart(object param)
            {
            }

            public Navigator Navigator
            {
                get { return nav; }
                set { nav = value; }
            }

            public TasksManager TasksManager
            {
                get { return tMan; }
                set { tMan = value; }
            }

            public string CurrViewName
            {
                get { return currViewName; }
                set { if (!viewNameIsFixed) currViewName = value; }
            }
	
        }

        class StubViewsManager : IViewsManager
        {
            private Navigator navigator;
            public static int viewActivationCount = 0;
            public static string lastViewNameActivated;

            public void ActivateView(string viewName)
            {
                viewActivationCount++;
                lastViewNameActivated = viewName;
            }

            public Navigator Navigator
            {
                get { return navigator; }
                set { navigator = value; }
            }

            public ViewInfoCollection ViewInfos
            {
                get { return null; }
                set { }
            }

            public IView GetView(string viewName)
            { return null; }
        }

        class StubFirstController : StubController
        { }

        class StubSecondController : StubController
        { }

        class StubController : IController
        {
            private ITask task;
            private IView view;

            public ITask Task
            {
                get { return task; }
                set { task = value; }
            }

            public IView View
            {
                get { return view; }
                set { view = value; }
            }
	
        }

        #endregion
    }
}
