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
    [WinformsView(typeof(MainTask), "About Dlg View", ShowModal = true)]
    public partial class AboutDialog : WinFormView
    {
        public AboutDialog()
        {
            InitializeComponent();
        }
    }
}