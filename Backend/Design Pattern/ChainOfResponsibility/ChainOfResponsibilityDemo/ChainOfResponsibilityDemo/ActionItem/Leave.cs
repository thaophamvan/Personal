using System;
using System.Collections.Generic;
using System.Text;

namespace ChainOfResponsibilityDemo
{
    // This is the actual Item that will be used by the concretehandlers
    // to determine whther they can act upon this request or not
    public class Leave
    {
        public Leave(Guid guid, int days)
        {
            leaveID = guid;
            numberOfDays = days;
        }

        Guid leaveID;

        public Guid LeaveID
        {
            get { return leaveID; }
            set { leaveID = value; }
        }
        int numberOfDays;

        public int NumberOfDays
        {
            get { return numberOfDays; }
            set { numberOfDays = value; }
        }
    }
}
