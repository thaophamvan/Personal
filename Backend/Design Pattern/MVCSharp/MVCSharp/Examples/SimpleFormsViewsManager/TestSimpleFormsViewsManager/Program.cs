using System;
using System.Collections.Generic;
using System.Windows.Forms;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Configuration;
using MVCSharp.Examples.SimpleFormsViewsManagerExample;
using MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.ApplicationLogic;

namespace MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.Presentation
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            TasksManager tm = new TasksManager(MVCConfiguration.GetDefault());
            tm.Config.ViewsManagerType = typeof(SimpleFormsViewsManager);

            tm.StartTask(typeof(MainTask));

            Application.Run(Application.OpenForms[0]);
        }
    }
}