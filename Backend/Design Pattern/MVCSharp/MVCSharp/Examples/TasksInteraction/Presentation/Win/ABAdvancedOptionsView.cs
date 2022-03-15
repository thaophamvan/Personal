using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Winforms;
using MVCSharp.Winforms.Configuration;
using MVCSharp.Examples.TasksInteraction.ApplicationLogic;

namespace MVCSharp.Examples.TasksInteraction.Presentation.Win
{
    [WinformsView(typeof(AwardBonusTask), AwardBonusTask.AdvancedOptionsView, ShowModal = true)]
    public partial class ABAdvancedOptionsView : WinFormView, IABAdvancedOptionsView
    {
        public ABAdvancedOptionsView()
        {
            InitializeComponent();
        }

        public bool IsWorkerOfTheMonth
        {
            get { return workerOfTheMonthCB.Checked; }
            set { workerOfTheMonthCB.Checked = value; }
        }

        public bool SpecialServices
        {
            get { return specialServicesCB.Checked; }
            set { specialServicesCB.Checked = value; }
        }

        private void okBtn_Click(object sender, EventArgs e)
        {
            (Controller as ABAdvancedOptionsController).DoEnterOptions();
        }
    }
}