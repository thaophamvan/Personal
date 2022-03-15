using System;
using System.Collections.Generic;
using System.Text;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Configuration.Tasks;
using MVCSharp.Core;

namespace MVCSharp.Examples.WindowsFormsExample.ApplicationLogic
{
    public class MainTask : TaskBase
    {
        [IPoint(typeof(MainViewController), IsCommonTarget = true)]
        public const string MainView = "Main View";

        [IPoint(typeof(ControllerBase), IsCommonTarget = true)]
        public const string MdiChild1 = "Mdi Child1";

        [IPoint(typeof(ControllerBase), IsCommonTarget = true)]
        public const string MdiChild2 = "Mdi Child2";

        [IPoint(typeof(ControllerBase), IsCommonTarget = true)]
        public const string UserControlView1 = "UserControlView1";

        [IPoint(typeof(ControllerBase), IsCommonTarget = true)]
        public const string UserControlView2 = "UserControlView2";

        [IPoint(typeof(ControllerBase), IsCommonTarget = true)]
        public const string AboutDlgView = "About Dlg View";

        public event EventHandler CurrViewChanged;

        public override string CurrViewName
        {
            get
            {
                return base.CurrViewName;
            }
            set
            {
                base.CurrViewName = value;
                if (CurrViewChanged != null)
                    CurrViewChanged(this, EventArgs.Empty);
            }
        }

        public override void OnStart(object param)
        {
            Navigator.NavigateDirectly("Main View");
        }
    }
}
