using System;
using System.Collections.Generic;
using System.Text;

namespace ChainOfResponsibilityDemo
{
    public abstract class Employee
    {
        // Every employee will have a supervisor
        protected Employee supervisor;

        // Event mechanism to know whenever a leave has been applied
        public delegate void OnLeaveApplied(Employee e, Leave l);
        public event OnLeaveApplied onLeaveApplied = null;

        // This will invoke events when the leave will be applied
        // i.e. the actual item will be handed over to the hierarchy of
        // concrete handlers.
        public void LeaveApplied(Employee s, Leave leave)
        {
            if (onLeaveApplied != null)
            {
                onLeaveApplied(this, leave);
            }
        }

        // This is the function which concrete handlers will use to take 
        // action, if they are able to take actions.
        public abstract void ApproveLeave(Leave leave);

        // getter to get the supervisor of current employee
        public Employee Supervisor
        {
            get
            {
                return supervisor;
            }
            set
            {
                supervisor = value;
            }
        }     
   
        // Using this we can apply for leave
        public void ApplyLeave(Leave l)
        {
            LeaveApplied(this, l);
        }
    }
}
