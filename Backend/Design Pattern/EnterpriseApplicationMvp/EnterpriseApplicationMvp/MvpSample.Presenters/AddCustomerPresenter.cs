using System;
using MvpSample.Core.DataInterfaces;
using MvpSample.Core.Domain;
using MvpSample.Presenters.ViewInterfaces;

namespace MvpSample.Presenters
{
    /// <summary>
    /// There's not a lot of reason to separate the "Edit" presenter from the "Add" presenter; but alas, 
    /// it makes for a more thorough example.
    /// </summary>
    public class AddCustomerPresenter
    {
        public AddCustomerPresenter(IAddCustomerView view, ICustomerDao customerDao) {
            if (view == null) throw new ArgumentNullException("view may not be null");
            if (customerDao == null) throw new ArgumentNullException("customerDao may not be null");

            this.view = view;
            this.customerDao = customerDao;
        }

        /// <summary>
        /// Raised when the user wants to cancel adding a new customer.  The containing ASPX page should 
        /// listen for this event.
        /// </summary>
        public EventHandler CancelAddEvent;

        /// <summary>
        /// Raised after the customer has been successfully added to the database.
        /// </summary>
        public EventHandler AddCustomerCompleteEvent;
        
        public void InitView() {
            view.Message = "Use this form to add a new customer.";
        }

        /// <summary>
        /// Called by the view; this grabs the updated customer from the view and commits it to the DB.
        /// </summary>
        public void AddCustomer(bool isPageValid) {
            // Be sure to check isPageValid before anything else
            if (! isPageValid) {
                view.Message = "There was a problem with your inputs.  Make sure you supplied everything and try again";
                return;
            }

            if (! IsDuplicateOfExisting(view.CustomerToAdd)) {
                customerDao.Save(view.CustomerToAdd);

                // You could certainly pass in more than just null for the event args
                AddCustomerCompleteEvent(this, null);
            }
            else {
                // By passing HTML tags from the presenter to the view, we've essentially bound the 
                // presenter to an HTML context.  You may want to consider alternatives to keep the 
                // presentation layer web/windows agnostic.
                view.Message = "<span style=\"color:red\">The ID you provided is already in use.</span>  " +
                               "Please change the ID and try again.";
            }
        }

        /// <summary>
        /// Checks if a customer already exists with the same customer ID.
        /// </summary>
        private bool IsDuplicateOfExisting(Customer newCustomer) {
            // Whenever possible, I *really* don't like using assigned IDs.  I think they 
            // should only be used when working with a legacy database.  Among other ugliness, 
            // assigned IDs force us to try/catch when checking for duplicates because NHibernate 
            // will throw an ObjectNotFoundException if no entity with the provided ID is found.
            // Consequently, we also have to have a reference to the NHibernate assembly from within
            // our business object.
            // To overcome these drawbacks, I'd recommend adding a DoesEntityExist(string assignedId) 
            // method to the DAO to check for the existence of entities by its assigned ID.  This would remove the
            // ugly try/catch from this method and it would also remove the local dependency on the NHibernate
            // assembly.  I've chosen not to go ahead and do this because my assumption is that
            // the use of assigned IDs will be the exception rather than the norm...so I want to keep
            // the generic DAO as clean as possible for the example demo.
            try {
                Customer duplicateCustomer = customerDao.GetById(newCustomer.ID, false);
                return duplicateCustomer != null;
            }
            // Only catch ObjectNotFoundException, throw everything else.
            catch (NHibernate.ObjectNotFoundException) {
                // Since the duplicate we were looking for wasn't found, then, through difficult 
                // logical deduction, this object isn't a duplicat
                return false;
            }
        }
        
        /// <summary>
        /// In this example solution, this is simply a pass-through method for the event
        /// to be raised.  In such a simple example, you may consider having the user control raise
        /// the event directly.  Conversely, there are times when other actions are taken before
        /// the event is raised.  In these situations, the presenter should definitely manage 
        /// raising the event after the other actions have been taken.
        /// </summary>
        public void CancelAdd() {
            CancelAddEvent(this, null);
        }

        private IAddCustomerView view;
        private ICustomerDao customerDao;
    }
}
