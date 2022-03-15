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

public partial class _Default : WebFormView, ICustomersView
{
    public void SetCustomersList(List<Customer> customers)
    {
        CustomersGridView.DataSource = customers;
    }

    public Customer CurrentCustomer
    {
        get { return (CustomersGridView.DataSource as List<Customer>)
                                    [CustomersGridView.SelectedIndex]; }
        set { CustomersGridView.SelectedIndex =
               (CustomersGridView.DataSource as IList).IndexOf(value); }
    }

    protected void ShowOrdersButton_Click(object sender, EventArgs e)
    {
        (Controller as CustomersController).ShowOrders();
    }

    protected void CustomersGridView_SelectedIndexChanged(object sender, EventArgs e)
    {
        (Controller as CustomersController).CurrentCustomerChanged();
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        DataBind();
    }
}
