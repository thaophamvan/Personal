using System;
using System.Collections.Generic;
using System.Windows.Forms;
using MVCSharp.Core.Tasks;
using MVCSharp.Winforms;
using MVCSharp.Examples.TasksInteraction.Model;
using MVCSharp.Examples.TasksInteraction.ApplicationLogic;

namespace MVCSharp.Examples.TasksInteraction.Presentation.Win
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            CreateTestData();
            TasksManager tasksManager = new TasksManager(WinformsViewsManager.
                                                         GetDefaultConfig());
            tasksManager.StartTask(typeof(MainTask));

            Application.Run(Application.OpenForms[0]);
        }

        private static void CreateTestData()
        {
            Employee.AllInstances.Add(new Employee("John", 30000));
            Employee.AllInstances.Add(new Employee("Pete", 20000));
            Employee.AllInstances.Add(new Employee("Andy", 25000));
        }
    }
}