using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Examples.TasksInteraction.Model;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public interface IEmployeesView
    {
        void SetEmployeesList(List<Employee> employees);

        Employee CurrentEmployee
        {
            get;
            set;
        }
    }
}
