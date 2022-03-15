using System;
using MvpSample.Core.Domain;
using MvpSample.Presenters;
using MvpSample.Presenters.ViewInterfaces;
using MvpSample.Tests.MockDao;
using NUnit.Framework;

namespace MvpSample.Tests.Presenters
{
    [TestFixture]
    public class EditCustomerPresenterTests
    {
        [Test]
        public void TestInitView() {
            IEditCustomerView view = new MockEditCustomerView();
            EditCustomerPresenter presenter = new EditCustomerPresenter(view, new MockCustomerDao());
            view.AttachPresenter(presenter);
            presenter.InitViewForEditing(customerId, false);

            Assert.AreEqual(customerId, view.CustomerToUpdate.ID);

            // For full unit testing, you should also be testing the presenter event handling.
            // A simple example of testing the events can be found in ListCustomersPresenterTests.
        }

        private class MockEditCustomerView : IEditCustomerView
        {
            private Customer customerToUpdate;

            public Customer CustomerToUpdate {
                set { customerToUpdate = value; }
                get {
                    if (customerToUpdate == null) throw new FieldAccessException("CustomerToUpdate has not been initialized");
                    return customerToUpdate;
                }
            }

            public void AttachPresenter(EditCustomerPresenter presenter) { }
        }
		
        private string customerId {
            get { return "ALFKI"; }
        }
    }
}
