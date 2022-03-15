using System;
using System.Collections.Generic;
using System.Text;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public interface IABMainView
    {
        int ContractsMade
        {
            get;
            set;
        }

        int CustomersAttracted
        {
            get;
            set;
        }
    }
}
