using System;
using System.Collections.Generic;
using System.Text;

namespace ChainOfResponsibilityDemo
{
    class HR : Employee
    {
        const int MAX_LEAVES_CAN_APPROVE = 30;

        // in constructor we will attach the event handler that
        // will check if this employee can process or 
        // some other action is needed
        public HR()
        {
            this.onLeaveApplied += new OnLeaveApplied(HR_onLeaveApplied);
        }

        // in this function we will check if this employee can 
        // process or some other action is needed
        void HR_onLeaveApplied(Employee e, Leave l)
        {
            // check if we can process this request
            if (l.NumberOfDays < MAX_LEAVES_CAN_APPROVE)
            {
                // process it on our level only
                ApproveLeave(l);
            }
            else
            {
                // if we cant process pass on to the supervisor 
                // so that he can process
                if (Supervisor != null)
                {
                    Supervisor.LeaveApplied(this, l);
                }
                else
                {
                    // There is no one up in hierarchy so lets 
                    // tell the user what he needs to do now
                    Console.WriteLine("Leave application suspended, Please contact HR");
                }
            }
        }

        // If we can process lets show the output
        public override void ApproveLeave(Leave leave)
        {
            Console.WriteLine("LeaveID: {0} Days: {1} Approver: {2}", 
                leave.LeaveID, leave.NumberOfDays, "HR");
        }
    }
}
