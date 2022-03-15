using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Configuration.Tasks;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public class MainTask : TaskBase
    {
        [IPoint(typeof(EmployeesController))]
        public const string Employees = "Employees";

        public override void OnStart(object param)
        {
            Navigator.ActivateView(Employees);
        }
    }
}
