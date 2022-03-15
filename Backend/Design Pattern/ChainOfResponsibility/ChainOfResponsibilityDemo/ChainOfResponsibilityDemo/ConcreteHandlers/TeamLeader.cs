using System;
using System.Collections.Generic;
using System.Text;

namespace ChainOfResponsibilityDemo
{
    public class TeamLeader : Employee
    {
        // team leas can only approve upto 7 days of leave
        const int MAX_LEAVES_CAN_APPROVE = 10;

        // in constructor we will attach the event handler that
        // will check if this employee can process or he need to
        // pass on to next employee
        public TeamLeader()
        {
            this.onLeaveApplied += new OnLeaveApplied(TeamLeader_onLeaveApplied);
        }

        // in this function we will check if this employee can 
        // process or he need to pass on to next employee
        void TeamLeader_onLeaveApplied(Employee e, Leave l)
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
            }
        }

        // If we can process lets show the output
        public override void ApproveLeave(Leave leave)
        {
            Console.WriteLine("LeaveID: {0} Days: {1} Approver: {2}", 
                leave.LeaveID, leave.NumberOfDays, "Team Leader");
        }
    }
}
