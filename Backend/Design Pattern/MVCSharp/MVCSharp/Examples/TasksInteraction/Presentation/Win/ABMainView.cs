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
    [WinformsView(typeof(AwardBonusTask), AwardBonusTask.MainView, ShowModal = true)]
    public partial class ABMainView : WinFormView, IABMainView
    {
        public ABMainView()
        {
            InitializeComponent();
        }

        public int ContractsMade
        {
            get { return (int)contractsNumUpDown.Value; }
            set { contractsNumUpDown.Value = value; }
        }

        public int CustomersAttracted
        {
            get { return (int)customersNumUpDown.Value; }
            set { customersNumUpDown.Value = value; }
        }

        private void okBtn_Click(object sender, EventArgs e)
        {
            (Controller as ABMainController).DoAwardBonus();
        }

        private void advancedLinkLbl_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            (Controller as ABMainController).ShowAdvancedOptions();
        }
    }
}