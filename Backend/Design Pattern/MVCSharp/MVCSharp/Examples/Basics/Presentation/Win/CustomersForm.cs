using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Core.Views;
using MVCSharp.Core;
using MVCSharp.Examples.Basics.ApplicationLogic;
using MVCSharp.Examples.Basics.Model;
using MVCSharp.Core.Configuration.Views;
using MVCSharp.Winforms;

namespace MVCSharp.Examples.Basics.Presentation.Win
{
    [View(typeof(MainTask), MainTask.Customers)]
    public partial class CustomersForm : WinFormView, ICustomersView
    {
        public CustomersForm()
        {
            InitializeComponent();
        }

        public void SetCustomersList(List<Customer> customers)
        {
            customersGridView.DataSource = customers;
        }

        public Customer CurrentCustomer
        {
            get { return customersGridView.CurrentRow == null ? null :
                         customersGridView.CurrentRow.DataBoundItem as Customer;}
            set { customersGridView.CurrentCell = customersGridView.Rows[
               (customersGridView.DataSource as IList).IndexOf(value)].Cells[0];}
        }

        private void customersGridView_CurrentCellChanged(object sender, EventArgs e)
        {
            (Controller as CustomersController).CurrentCustomerChanged();
        }

        private void showOrdersButton_Click(object sender, EventArgs e)
        {
            (Controller as CustomersController).ShowOrders();
        }
    }
}