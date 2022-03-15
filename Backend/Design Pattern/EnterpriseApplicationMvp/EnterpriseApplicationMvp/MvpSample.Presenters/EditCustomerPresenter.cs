using System;
using MvpSample.Core.DataInterfaces;
using MvpSample.Presenters.ViewInterfaces;

namespace MvpSample.Presenters
{
    /// <summary>
    /// There's not a lot of reason to separate the "Edit" presenter from the "Add" presenter; but alas, 
    /// it makes for a more thorough example.
    /// </summary>
    public class EditCustomerPresenter
    {
        public EditCustomerPresenter(IEditCustomerView view, ICustomerDao customerDao) {
            if (view == null) throw new ArgumentNullException("view may not be null");
            if (customerDao == null) throw new ArgumentNullException("customerDao may not be null");

            this.view = view;
            this.customerDao = customerDao;
        }

        /// <summary>
        /// Raised when the user wants to cancel editing a customer.  The containing ASPX page should 
        /// listen for this event.
        /// </summary>
        public EventHandler CancelUpdateEvent;

        /// <summary>
        /// Raised after the customer has been successfully committed to the database.
        /// </summary>
        public EventHandler UpdateCustomerCompleteEvent;

        public void InitViewForEditing(string customerId, bool isPostBack) {
            if (string.IsNullOrEmpty(customerId))
                throw new ArgumentNullException("customerId may not be null or empty");

            if (! isPostBack) {
                view.CustomerToUpdate = customerDao.GetById(customerId, false);
            }
        }

        /// <summary>
        /// Called by the view; this grabs the updated customer from the view and commits it to the DB.
        /// </summary>
        public void UpdateCustomer(bool isPageValid) {
            // Here's an example of taking into account if Page.IsValid.  Of course, if it fails, 
            // you'd want to send a message back to the view stating that there was a problem with 
            // the inputs.  For an example of having the presenter send a message back to the view,
            // see ListCustomersPresenter.
            if (isPageValid) {
                customerDao.SaveOrUpdate(view.CustomerToUpdate);

                // You could certainly pass in more than just null for the event args
                UpdateCustomerCompleteEvent(this, null);
            }
        }
        
        /// <summary>
        /// In this example solution, this is simply a pass-through method for the event
        /// to be raised.  In such a simple example, you may consider having the user control raise
        /// the event directly.  Conversely, there are times when other actions are taken before
        /// the event is raised.  In these situations, the presenter should definitely manage 
        /// raising the event after the other actions have been taken.
        /// </summary>
        public void CancelUpdate() {
            CancelUpdateEvent(this, null);
        }
        
        private IEditCustomerView view;
        private ICustomerDao customerDao;
    }
}
