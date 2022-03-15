using System;
using System.Web.UI;
using MvpSample.Core.Domain;
using MvpSample.Presenters;
using MvpSample.Presenters.ViewInterfaces;

public partial class Views_AddCustomerView : UserControl, IAddCustomerView
{
    public string Message {
        set { lblMessage.Text = value; }
    }

    public void AttachPresenter(AddCustomerPresenter presenter) {
        this.presenter = presenter;
    }

    public Customer CustomerToAdd {
        get {
            Customer customer = new Customer(txtCompanyName.Text);
            customer.ID = txtCustomerID.Text;
            customer.ContactName = txtContactName.Text;
            return customer;
        }
    }

    protected void btnAdd_OnClick(object sender, EventArgs e) {
        presenter.AddCustomer(Page.IsValid);
    }
    
    protected void btnCancel_OnClick(object sender, EventArgs e) {
        presenter.CancelAdd();
    }
    
    private AddCustomerPresenter presenter;
}
