using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Core.Views;
using MVCSharp.Examples.Basics.ApplicationLogic;
using MVCSharp.Examples.Basics.Model;
using MVCSharp.Core;
using MVCSharp.Core.Configuration.Views;
using MVCSharp.Winforms;

namespace MVCSharp.Examples.Basics.Presentation.Win
{
    [View(typeof(MainTask), MainTask.Orders)]
    public partial class OrdersForm : WinFormView, IOrdersView
    {
        public OrdersForm()
        {
            InitializeComponent();
        }

        public void SetOrdersList(List<Order> orders)
        {
            ordersGridView.DataSource = orders;
        }

        public Order CurrentOrder
        {
            get { return ordersGridView.CurrentRow == null ? null :
                         ordersGridView.CurrentRow.DataBoundItem as Order; }
        }

        public void SetOperationsEnabling(bool acceptIsEnabled, bool shipIsEnabled, bool cancelIsEnabled)
        {
            acceptOrderBtn.Enabled = acceptIsEnabled;
            shipOrderBtn.Enabled = shipIsEnabled;
            cancelOrderBtn.Enabled = cancelIsEnabled;
        }

        private void ordersGridView_CurrentCellChanged(object sender, EventArgs e)
        {
            (Controller as OrdersController).CurrentOrderChanged();
        }

        private void acceptOrderBtn_Click(object sender, EventArgs e)
        {
            (Controller as OrdersController).AcceptOrder();
        }

        private void shipOrderBtn_Click(object sender, EventArgs e)
        {
            (Controller as OrdersController).ShipOrder();
        }

        private void cancelOrderBtn_Click(object sender, EventArgs e)
        {
            (Controller as OrdersController).CancelOrder();
        }

        private void showCustomersButton_Click(object sender, EventArgs e)
        {
            (Controller as OrdersController).ShowCustomers();
        }

    }
}