using System;
using System.Collections.Generic;
using System.Text;
using System.Reflection;
using NUnit.Framework;
using MVCSharp.Webforms.Configuration;
using MVCSharp.Core.Configuration.Views;

namespace MVCSharp.Tests.Webforms.Configuration
{
    [TestFixture]
    public class TestWebformsViewInfosProvider
    {
        [Test]
        public void TestGetFromAssembly()
        {
            ViewInfosByTaskCollection viewInfsByTask = new WebformsViewInfosProvider()
                                        .GetFromAssembly(Assembly.GetExecutingAssembly());
            WebformsViewInfoCollection viewInfs1 = viewInfsByTask[typeof(int)] as WebformsViewInfoCollection;
            WebformsViewInfoCollection viewInfs2 = viewInfsByTask[typeof(string)] as WebformsViewInfoCollection;
            WebformsViewInfoCollection viewInfs3 = viewInfsByTask[typeof(Array)] as WebformsViewInfoCollection;

            Assert.IsNotNull(viewInfs1);
            Assert.IsNotNull(viewInfs2);
            Assert.IsNotNull(viewInfs3);

            WebformsViewInfo viewInf1 = viewInfs1["MainView"];
            Assert.AreEqual("MainView", viewInf1.ViewName);
            Assert.AreEqual("default.aspx", viewInf1.ViewUrl);

            Assert.AreSame(viewInfs2["MainView"], viewInfs2.GetByUrl("Other/Default.aspx"));
            Assert.AreSame(viewInfs2["Other View"], viewInfs2.GetByUrl("Other/Other.aspx"));
            Assert.AreSame(viewInfs2["Other View 2"], viewInfs2.GetByUrl("~/Other/Other2.aspx"));
        }
    }

    
    [WebformsView(typeof(int), "MainView", "Default.aspx")]
    [WebformsView(typeof(string), "MainView", "/Other/default.aspx")]
    [WebformsView(typeof(string), "Other View", "Other/Other.aspx")]
    [WebformsView(typeof(string), "Other View 2", "~/Other/Other2.aspx")]
    class ViewInfos
    {
        [WebformsView(typeof(Array), "Main View", "Array/Default.aspx")]
        class Inner
        { }
    }

}
