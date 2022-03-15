using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Views;
using MVCSharp.Core.Configuration.Views;

namespace MVCSharp.Examples.WindowsFormsExample.ApplicationLogic
{
    public class MainViewController : ControllerBase
    {
        public override ITask Task
        {
            get { return base.Task; }
            set
            {
                base.Task = value;
                (Task as MainTask).CurrViewChanged += CurrViewChanged;
            }
        }

        public override IView View
        {
            get { return base.View; }
            set
            {
                base.View = value;
                CurrViewChanged(Task, EventArgs.Empty);
            }
        }

        void CurrViewChanged(object sender, EventArgs e)
        {
            (View as IMainView).SetCurrViewName(Task.CurrViewName);
        }

        public void Navigate(string viewName)
        {
            try
            {
                Task.Navigator.Navigate(viewName);
            }
            catch (ViewInfoNotFoundException) { }
        }
    }
}
