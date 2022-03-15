using System;
using System.Collections.Generic;
using System.Windows.Forms;
using MVCSharp.Core.Configuration;
using MVCSharp.Core.Tasks;
using MVCSharp.Winforms;
using MVCSharp.Examples.Basics.Model;
using MVCSharp.Examples.Basics.ApplicationLogic;

namespace MVCSharp.Examples.Basics.Presentation.Win
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
            Customer.AllCustomers.Add(new Customer("John"));
            Customer.AllCustomers.Add(new Customer("Paul"));

            Customer.AllCustomers[0].Orders.Add(new Order());
            Customer.AllCustomers[0].Orders.Add(new Order());
            Customer.AllCustomers[0].Orders.Add(new Order());

            Customer.AllCustomers[1].Orders.Add(new Order());
            Customer.AllCustomers[1].Orders.Add(new Order());
        }
    }
}