using System;
using MvpSample.Core.DataInterfaces;
using MvpSample.Presenters;

public partial class EditCustomer : BasePage
{
    protected override void PageLoad() {
        // DaoFactory is inherited from BasePage
        ICustomerDao customerDao = DaoFactory.GetCustomerDao();

        EditCustomerPresenter presenter = new EditCustomerPresenter(editCustomerView, customerDao);
        editCustomerView.AttachPresenter(presenter);
        presenter.UpdateCustomerCompleteEvent += new EventHandler(HandleUpdateCustomerCompleteEvent);
        presenter.CancelUpdateEvent += new EventHandler(HandleCancelUpdateEvent);
        presenter.InitViewForEditing(Request.QueryString["customerID"], IsPostBack);
    }
    
    private void HandleUpdateCustomerCompleteEvent(object sender, EventArgs e) {
        Response.Redirect("ListCustomers.aspx?action=updated");
    }

    private void HandleCancelUpdateEvent(object sender, EventArgs e) {
        Response.Redirect("ListCustomers.aspx");
    }
}
