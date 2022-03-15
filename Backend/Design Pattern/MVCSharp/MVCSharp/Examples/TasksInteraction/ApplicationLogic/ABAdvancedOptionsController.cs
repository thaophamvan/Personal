using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;

namespace MVCSharp.Examples.TasksInteraction.ApplicationLogic
{
    public class ABAdvancedOptionsController : ControllerBase
    {
        public override MVCSharp.Core.Views.IView View
        {
            get { return base.View; }
            set
            {
                base.View = value;
                (View as IABAdvancedOptionsView).IsWorkerOfTheMonth = (Task as
                                                    AwardBonusTask).IsWorkerOfTheMonth;
                (View as IABAdvancedOptionsView).SpecialServices = (Task as
                                                    AwardBonusTask).SpecialServices;
            }
        }

        public void DoEnterOptions()
        {
            (Task as AwardBonusTask).IsWorkerOfTheMonth = (View as
                                    IABAdvancedOptionsView).IsWorkerOfTheMonth;
            (Task as AwardBonusTask).SpecialServices = (View as
                                    IABAdvancedOptionsView).SpecialServices;
            Task.Navigator.Navigate(AwardBonusTask.MainView);
        }
    }
}
