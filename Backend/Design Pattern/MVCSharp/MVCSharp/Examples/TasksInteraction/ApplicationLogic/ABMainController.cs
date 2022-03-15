using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;
using MVCSharp.Core.Views;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public class ABMainController : ControllerBase
    {
        public override IView View
        {
            get { return base.View; }
            set
            {
                if (View != null)
                {
                    (value as IABMainView).ContractsMade = (View as IABMainView).ContractsMade;
                    (value as IABMainView).CustomersAttracted = (View as IABMainView).CustomersAttracted;
                }
                base.View = value;
            }
        }

        public void DoAwardBonus()
        {
            int contractsMade = (View as IABMainView).ContractsMade;
            int customersAttracted = (View as IABMainView).CustomersAttracted;
            decimal baseSalary = (Task as AwardBonusTask).Employee.BaseSalary;
            decimal workerOfTheMonthBonus =
              (Task as AwardBonusTask).IsWorkerOfTheMonth ? baseSalary * .1m : 0;
            decimal specialServicesBonus =
              (Task as AwardBonusTask).SpecialServices ? baseSalary * .05m : 0;
            (Task as AwardBonusTask).Employee.SetBonusSum(contractsMade * 15000m +
                             customersAttracted * 15000m + workerOfTheMonthBonus +
                             specialServicesBonus);

            (Task as AwardBonusTask).OriginatingTask.OnStart(null);
        }

        public void ShowAdvancedOptions()
        {
            Task.Navigator.Navigate(AwardBonusTask.AdvancedOptionsView);
        }
    }
}
