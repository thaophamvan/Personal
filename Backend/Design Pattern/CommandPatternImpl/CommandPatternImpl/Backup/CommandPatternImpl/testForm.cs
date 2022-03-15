using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace CommandPatternImpl
{
    public partial class testForm : Form
    {
        IReciever calculator = null;
        ACommand command = null;
        AddCommand addCmd = null;
        SubtractCommand subCmd = null;
        MultiplyCommand mulCmd = null;

        public testForm()
        {
            InitializeComponent();
        }

        private void testForm_Load(object sender, EventArgs e)
        {
            calculator = new Calculator(20, 10);

            addCmd = new AddCommand(calculator);
            subCmd = new SubtractCommand(calculator);
            mulCmd = new MultiplyCommand(calculator);
        }

        private void radioAdd_CheckedChanged(object sender, EventArgs e)
        {
            if (radioAdd.Checked == true)
            {
                command = addCmd;
            }
            else if(radioSub.Checked == true)
            {
                command = subCmd;
            }
            else if (radioMultiply.Checked == true)
            {
                command = mulCmd;
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            label3.Text = "Result: " + command.Execute().ToString();
        }

        
    }
}