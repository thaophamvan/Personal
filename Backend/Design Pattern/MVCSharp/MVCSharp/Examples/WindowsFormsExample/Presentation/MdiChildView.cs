using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Winforms;
using MVCSharp.Winforms.Configuration;
using MVCSharp.Examples.WindowsFormsExample.ApplicationLogic;

namespace MVCSharp.Examples.WindowsFormsExample.Presentation
{
    [WinformsView(typeof(MainTask), "Mdi Child1", MdiParent = "Main View")]
    [WinformsView(typeof(MainTask), "Mdi Child2", MdiParent = "Main View")]
    public partial class MdiChildView : WinFormView
    {
        public MdiChildView()
        {
            InitializeComponent();
        }

        public override void Initialize()
        {
            if (ViewName == "Mdi Child1")
                userControlView.ViewName = "UserControlView1";
            else if (ViewName == "Mdi Child2")
                userControlView.ViewName = "UserControlView2";
            Text = ViewName;
        }

        public override void Activate(bool activate)
        {
            textBox.Text = activate ? "Active" : "Inactive";
        }
    }
}
