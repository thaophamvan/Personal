using System;
using System.Collections.Generic;
using System.Text;

namespace ChainOfResponsibilityDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            // lets create employees 
            TeamLeader tl = new TeamLeader();
            ProjectLeader pl = new ProjectLeader();
            HR hr = new HR();

            // Now lets set the hierarchy of employees
            tl.Supervisor = pl;
            pl.Supervisor = hr;

            // Now lets apply 5 day leave my TL
            tl.ApplyLeave(new Leave(Guid.NewGuid(), 5));

            // Now lets apply 15 day leave my TL
            tl.ApplyLeave(new Leave(Guid.NewGuid(), 15));

            // Now lets apply 25 day leave my TL
            tl.ApplyLeave(new Leave(Guid.NewGuid(), 25));

            // Now lets apply 35 day leave my TL
            tl.ApplyLeave(new Leave(Guid.NewGuid(), 35));

            Console.ReadLine();
        }
    }
}
