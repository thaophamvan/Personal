using System;
using MvpSample.Core.DataInterfaces;
using MvpSample.Presenters;

public partial class ListCustomers : BasePage
{
    protected override void PageLoad() {
        // DaoFactory is inherited from BasePage
        ICustomerDao customerDao = DaoFactory.GetCustomerDao();

        ListCustomersPresenter presenter = new ListCustomersPresenter(listCustomersView, customerDao);
        listCustomersView.AttachPresenter(presenter);
        presenter.AddCustomerEvent += new EventHandler(HandleAddCustomerEvent);
        presenter.InitViewFor(Request.QueryString["action"]);
    }

    private void HandleAddCustomerEvent(object sender, EventArgs e) {
        // This redirect is fine since it's such a simple redirect, but be sure to check out 
        // PageMethods for redirection in your production application
        Response.Redirect("AddCustomer.aspx");
    }
}
