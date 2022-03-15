using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Winforms;
using MVCSharp.Winforms.Configuration;
using MVCSharp.Examples.WindowsFormsExample.ApplicationLogic;

namespace MVCSharp.Examples.WindowsFormsExample.Presentation
{
    [WinformsView(typeof(MainTask), "Main View", IsMdiParent = true)]
    public partial class MainForm : WinFormView, IMainView
    {
        public MainForm()
        {
            InitializeComponent();
        }

        public void SetCurrViewName(string viewName)
        {
            currentViewStatusLbl.Text = viewName;
        }

        private void ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            (Controller as MainViewController).Navigate((sender as ToolStripMenuItem).Text);
        }
    }
}