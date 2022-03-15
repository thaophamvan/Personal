using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Winforms;
using MVCSharp.Winforms.Configuration;
using MVCSharp.Examples.TasksInteraction.ApplicationLogic;
using MVCSharp.Examples.TasksInteraction.Model;

namespace MVCSharp.Examples.TasksInteraction.Presentation.Win
{
    [WinformsView(typeof(MainTask), MainTask.Employees)]
    public partial class EmployeesView : WinFormView, IEmployeesView
    {
        public EmployeesView()
        {
            InitializeComponent();
        }

        public Employee CurrentEmployee
        {
            get { return employeesGridView.CurrentRow == null ? null :
                         employeesGridView.CurrentRow.DataBoundItem as Employee;}
            set { employeesGridView.CurrentCell = employeesGridView.Rows[
               (employeesGridView.DataSource as IList).IndexOf(value)].Cells[0];}
        }

        public void SetEmployeesList(List<Employee> employees)
        {
            employeesGridView.DataSource = employees;
        }

        private void awardBonusBtn_Click(object sender, EventArgs e)
        {
            (Controller as EmployeesController).AwardBounus();
        }
    }
}