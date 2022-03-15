using System;
using System.Collections.Generic;
using System.Windows.Forms;
using MVCSharp.Examples.WindowsFormsExample.Presentation;
using MVCSharp.Core.Tasks;
using MVCSharp.Winforms;
using MVCSharp.Core.Configuration;
using MVCSharp.Examples.WindowsFormsExample.ApplicationLogic;

namespace WindowsFormsExample
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            MVCConfiguration config = WinformsViewsManager.GetDefaultConfig();
            (new TasksManager(config)).StartTask(typeof(MainTask));
            
            Application.Run(Application.OpenForms[0]);
        }
    }
}