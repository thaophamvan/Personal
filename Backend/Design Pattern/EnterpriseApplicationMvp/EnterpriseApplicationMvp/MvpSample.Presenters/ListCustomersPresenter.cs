using System;
using MvpSample.Core.DataInterfaces;
using MvpSample.Presenters.ViewInterfaces;

namespace MvpSample.Presenters
{
    public class ListCustomersPresenter
    {
        public ListCustomersPresenter(IListCustomersView view, ICustomerDao customerDao) {
            if (view == null) throw new ArgumentNullException("view may not be null");
            if (customerDao == null) throw new ArgumentNullException("customerDao may not be null");

            this.view = view;
            this.customerDao = customerDao;
        }

        /// <summary>
        /// Raised when the user wants to add a new customer.  The containing ASPX page should 
        /// listen for this event.
        /// </summary>
        public EventHandler AddCustomerEvent;

        public void InitViewFor(string action) {
            DisplayMessageFor(action);
            
            view.Customers = customerDao.GetAll();
        }

        /// <summary>
        /// In this example solution, this is simply a pass-through method for the event
        /// to be raised.  In such a simple example, you may consider having the user control raise
        /// the event directly.  Conversely, there are times when other actions are taken before
        /// the event is raised.  In these situations, the presenter should definitely manage 
        /// raising the event after the other actions have been taken.
        /// </summary>
        public void AddCustomer() {
            AddCustomerEvent(this, null);
        }
        
         /// <summary>
        /// Reviews the supplied action and sets an appropriate message onto the view
        /// </summary>
        /// <param name="action">Alternatively, this could be provided as a enum value to make it 
        /// more strongly typed.</param>
        private void DisplayMessageFor(string action) {
            if (action == "updated") {
                view.Message = "The customer was successfully updated.";
            }
            else if (action == "added") {
                view.Message = "The customer was successfully added.";
            }
            else {
                view.Message = "Click a customer's ID to edit the customer.";
            }
        }

        private IListCustomersView view;
        private ICustomerDao customerDao;
    }
}
