using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;

namespace MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.ApplicationLogic
{
    class MainController : ControllerBase
    {
        public void NavigateToView1()
        {
            Task.Navigator.Navigate(MainTask.View1);
        }

        public void NavigateToView2()
        {
            Task.Navigator.Navigate(MainTask.View2);
        }
    }
}
