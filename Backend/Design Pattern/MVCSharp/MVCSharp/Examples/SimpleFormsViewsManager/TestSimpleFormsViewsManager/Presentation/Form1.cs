using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Core.Configuration.Views;
using MVCSharp.Core.Views;
using MVCSharp.Core;
using MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.ApplicationLogic;

namespace MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.Presentation
{
    [View(typeof(MainTask), MainTask.View1)]
    public partial class Form1 : Form, IView
    {
        private IController controller;
        private string viewName;
        
        public Form1()
        {
            InitializeComponent();
        }

        public IController Controller
        {
            get { return controller; }
            set { controller = value; }
        }

        public string ViewName
        {
            get { return viewName; }
            set { viewName = value; }
        }

        private void toView2Btn_Click(object sender, EventArgs e)
        {
            (Controller as MainController).NavigateToView2();
        }
    }
}