using System;
using System.Collections.Generic;
using System.Text;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public interface IABAdvancedOptionsView
    {
        bool IsWorkerOfTheMonth
        {
            get;
            set;
        }

        bool SpecialServices
        {
            get;
            set;
        }
    }
}
