using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Winforms;

namespace MVCSharp.Examples.WindowsFormsExample.Presentation
{
    public partial class UserControlView : WinUserControlView
    {
        public UserControlView()
        {
            InitializeComponent();
        }

        public override void Activate(bool activate)
        {
            textBox.Text = activate ? "Active" : "Inactive";
        }
    }
}
