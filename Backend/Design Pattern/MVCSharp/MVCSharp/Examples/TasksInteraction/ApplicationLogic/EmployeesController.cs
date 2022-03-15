using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;
using MVCSharp.Core.Views;
using MVCSharp.Examples.TasksInteraction.Model;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public class EmployeesController : ControllerBase
    {
        public override IView View
        {
            get { return base.View; }
            set
            {
                base.View = value;
                (View as IEmployeesView).SetEmployeesList(Employee.AllInstances);
                (View as IEmployeesView).CurrentEmployee = Employee.AllInstances[0];
            }
        }

        public void AwardBounus()
        {
            Employee currEmpl = (View as IEmployeesView).CurrentEmployee;
            Task.TasksManager.StartTask(typeof(AwardBonusTask),
                                        new object[] { currEmpl, Task });
        }
    }
}
