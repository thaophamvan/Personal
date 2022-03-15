using System;
using System.Collections.Generic;
using MvpSample.Core.Domain;
using MvpSample.Presenters;
using MvpSample.Presenters.ViewInterfaces;
using MvpSample.Tests.MockDao;
using NUnit.Framework;

namespace MvpSample.Tests.Presenters
{
    [TestFixture]
    public class ListCustomersPresenterTests
    {
        [Test]
        public void TestInitView() {
            MockListCustomersView view = new MockListCustomersView();
            ListCustomersPresenter presenter = new ListCustomersPresenter(view, new MockCustomerDao());
            view.AttachPresenter(presenter);
            presenter.InitViewFor(null);

            Assert.AreEqual(3, view.Customers.Count);
            Assert.AreEqual("Click a customer's ID to edit the customer.", view.Message);

            presenter.InitViewFor("added");
            Assert.AreEqual("The customer was successfully added.", view.Message);

            // The following is a simple example of testing the presenter events.  You could certainly
            // get much more sophisticated in your event testing than just the following.
            presenter.AddCustomerEvent += new EventHandler(HandleAddCustomerEvent);
            presenter.AddCustomer();
            Assert.IsTrue(eventHandled);
        }
        
        private void HandleAddCustomerEvent(object sender, EventArgs e) {
            eventHandled = true;
        }

        private bool eventHandled = false;

        private class MockListCustomersView : IListCustomersView
        {
            public void AttachPresenter(ListCustomersPresenter presenter) { }

            public string Message {
                set { message = value; }
                get {
                    if (message == null) throw new FieldAccessException("Message has not been initialized");
                    return message;
                }
            }

            public IList<Customer> Customers {
                set { customers = value; }
                get {
                    if (customers == null) throw new FieldAccessException("Customers has not been initialized");
                    return customers;
                }
            }

            private IList<Customer> customers;
            private string message;
        }
    }
}
