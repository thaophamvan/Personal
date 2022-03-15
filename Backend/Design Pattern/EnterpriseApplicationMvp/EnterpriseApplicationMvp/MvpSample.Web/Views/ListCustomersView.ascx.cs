using System;
using System.Collections.Generic;
using System.Web.UI;
using MvpSample.Core.Domain;
using MvpSample.Presenters;
using MvpSample.Presenters.ViewInterfaces;

public partial class Views_ListCustomersView : UserControl, IListCustomersView
{
    public void AttachPresenter(ListCustomersPresenter presenter) {
        this.presenter = presenter;
    }

    public string Message {
        set { lblMessage.Text = value; }
    }

    /// <summary>
    /// Provides a pass-through for the Customers to be bound to the GridView.  We do not want 
    /// to expose the GridView directly so that the Presenters layer does not have a dependency 
    /// on System.Web nor has a dependency on an "implementation detail" of the view.
    /// </summary>
    public IList<Customer> Customers {
        set {
            grdEmployees.DataSource = value;
            grdEmployees.DataBind();
        }
    }
    
    /// <summary>
    /// This hands control off to the presenter to raise the event that the user is requesting
    /// to add a new customer; alternatively, you could have the user control raise the event
    /// itself.  The downside is that, in some cases, the ASPX page may end up having to register
    /// for events with both the user control *and* the presenter.
    /// </summary>
    protected void btnAddCustomer_OnClick(object sender, EventArgs e) {
        presenter.AddCustomer();
    }

    ListCustomersPresenter presenter;
}
