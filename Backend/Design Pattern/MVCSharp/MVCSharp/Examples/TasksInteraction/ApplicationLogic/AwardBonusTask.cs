using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Examples.TasksInteraction.Model;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public class AwardBonusTask : TaskBase
    {
        [IPoint(typeof(ABMainController), AdvancedOptionsView)]
        public const string MainView = "Main View";

        [IPoint(typeof(ABAdvancedOptionsController), MainView)]
        public const string AdvancedOptionsView = "Advanced Options View";

        public Employee Employee;
        public ITask OriginatingTask;

        public bool IsWorkerOfTheMonth = false;
        public bool SpecialServices = false;

        public override void OnStart(object param)
        {
            Employee = (param as object[])[0] as Employee;
            OriginatingTask = (param as object[])[1] as ITask;
            Navigator.NavigateDirectly(MainView);
        }
    }
}
