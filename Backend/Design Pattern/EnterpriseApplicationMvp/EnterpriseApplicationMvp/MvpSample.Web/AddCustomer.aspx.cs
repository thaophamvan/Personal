using System;
using MvpSample.Core.DataInterfaces;
using MvpSample.Presenters;

public partial class AddCustomer : BasePage
{
    protected override void PageLoad() {
        // DaoFactory is inherited from BasePage
        ICustomerDao customerDao = DaoFactory.GetCustomerDao();

        AddCustomerPresenter presenter = new AddCustomerPresenter(addCustomerView, customerDao);
        addCustomerView.AttachPresenter(presenter);
        presenter.AddCustomerCompleteEvent += new EventHandler(HandleAddCustomerCompleteEvent);
        presenter.CancelAddEvent += new EventHandler(HandleCancelAddEvent);
        presenter.InitView();
    }
    
    private void HandleAddCustomerCompleteEvent(object sender, EventArgs e) {
        Response.Redirect("ListCustomers.aspx?action=added");
    }

    private void HandleCancelAddEvent(object sender, EventArgs e) {
        Response.Redirect("ListCustomers.aspx");
    }
}