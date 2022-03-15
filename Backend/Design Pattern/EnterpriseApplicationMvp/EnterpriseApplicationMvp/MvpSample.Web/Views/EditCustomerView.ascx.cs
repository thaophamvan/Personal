using System;
using System.Web.UI;
using MvpSample.Core.Domain;
using MvpSample.Presenters;
using MvpSample.Presenters.ViewInterfaces;

public partial class Views_EditCustomerView : UserControl, IEditCustomerView
{
    /// <summary>
    /// Provides a means for setting/retrieving the <see cref="Customer" /> to be updated.
    /// Arguably, you could just pass primitives back and forth instead of having the view
    /// be bound to the domain layer...but passing primitives could become quite painful
    /// very quickly.  IMO, the benefits of brevity outweigh the "disadvantages" of 
    /// being dependent on the domain layer.
    /// </summary>
    public Customer CustomerToUpdate {
        get {
            Customer updatedCustomer = new Customer(txtCompanyName.Text);
            updatedCustomer.ID = hidCustomerID.Value;
            updatedCustomer.ContactName = txtContactName.Text;
            return updatedCustomer;
        }
        set {
            if (value == null) throw new ArgumentNullException("CustomerToUpdate may not be null");
            
            hidCustomerID.Value = value.ID;
            lblCustomerID.Text = value.ID;
            txtCompanyName.Text = value.CompanyName;
            txtContactName.Text = value.ContactName;

            grdOrders.DataSource = value.Orders;
            grdOrders.DataBind();
        }
    }

    public void AttachPresenter(EditCustomerPresenter presenter) {
        this.presenter = presenter;
    }
    
    protected void btnUpdate_OnClick(object sender, EventArgs e) {
        // Instead of having the presenter grab the updated customer via the CustomerToUpdate's getter,
        // you could also pass the updated Customer directly to the UpdateCustomer method.  I prefer
        // the consistency of using the getter/setter pair.
        presenter.UpdateCustomer(Page.IsValid);
    }

    protected void btnCancel_OnClick(object sender, EventArgs e) {
        presenter.CancelUpdate();
    }
    
    private EditCustomerPresenter presenter;
}
