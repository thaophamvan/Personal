using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using MVCSharp.Webforms;
using MVCSharp.Examples.Basics.ApplicationLogic;
using MVCSharp.Examples.Basics.Model;

public partial class Orders : WebFormView, IOrdersView
{
    public void SetOrdersList(List<Order> orders)
    {
        OrdersGridView.DataSource = orders;
    }

    public Order CurrentOrder
    {
        get
        {
            List<Order> orders = OrdersGridView.DataSource as List<Order>;
            if (OrdersGridView.SelectedIndex >= orders.Count)
                OrdersGridView.SelectedIndex = orders.Count - 1;
            return orders[OrdersGridView.SelectedIndex] as Order;
        }
    }

    public void SetOperationsEnabling(bool AcceptIsEnabled, bool ShipIsEnabled, bool CancelIsEnabled)
    {
        AcceptOrderBtn.Enabled = AcceptIsEnabled;
        ShipOrderBtn.Enabled = ShipIsEnabled;
        CancelOrderBtn.Enabled = CancelIsEnabled;
    }

    protected void AcceptOrderBtn_Click(object sender, EventArgs e)
    {
        (Controller as OrdersController).AcceptOrder();
    }

    protected void ShipOrderBtn_Click(object sender, EventArgs e)
    {
        (Controller as OrdersController).ShipOrder();
    }

    protected void CancelOrderBtn_Click(object sender, EventArgs e)
    {
        (Controller as OrdersController).CancelOrder();
    }

    protected void OrdersGridView_SelectedIndexChanged(object sender, EventArgs e)
    {
        (Controller as OrdersController).CurrentOrderChanged();
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        DataBind();
    }

    protected void ShowCustomersButton_Click(object sender, EventArgs e)
    {
        (Controller as OrdersController).ShowCustomers();
    }
}
