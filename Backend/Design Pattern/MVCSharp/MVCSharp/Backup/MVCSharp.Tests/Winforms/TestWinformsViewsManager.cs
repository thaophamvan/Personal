using System;
using System.Collections.Generic;
using System.Text;
using NUnit.Framework;
using MVCSharp.Winforms;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Winforms.Configuration;
using MVCSharp.Core.Configuration;
using System.Reflection;

namespace MVCSharp.Tests.Winforms
{
    [TestFixture]
    public class TestWinformsViewsManager
    {
        [Test]
        public void TestGetDefaultConfig()
        {
            MVCConfiguration defaultConf = WinformsViewsManager.GetDefaultConfig();
            Assert.AreEqual(typeof(DefaultTaskInfoProvider), defaultConf.TaskInfoProviderType);
            Assert.AreEqual(typeof(WinformsViewInfosProvider), defaultConf.ViewInfosProviderType);
            Assert.AreEqual(typeof(WinformsViewsManager), defaultConf.ViewsManagerType);
            Assert.AreEqual(Assembly.GetExecutingAssembly(), defaultConf.ViewsAssembly);
            Assert.AreNotSame(defaultConf, WinformsViewsManager.GetDefaultConfig());
        }
    }
}