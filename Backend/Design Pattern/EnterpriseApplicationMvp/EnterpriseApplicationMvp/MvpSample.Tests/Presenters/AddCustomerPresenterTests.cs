using MvpSample.Core.Domain;
using MvpSample.Presenters;
using MvpSample.Presenters.ViewInterfaces;
using MvpSample.Tests.MockDao;
using NUnit.Framework;

namespace MvpSample.Tests.Presenters
{
    [TestFixture]
    public class AddCustomerPresenterTests
    {
        [Test]
        public void TestInitView() {
            MockAddCustomerView view = new MockAddCustomerView();
            AddCustomerPresenter presenter = new AddCustomerPresenter(view, new MockCustomerDao());
            view.AttachPresenter(presenter);
            presenter.InitView();

            Assert.AreEqual("Use this form to add a new customer.", view.Message);

            // For full unit testing, you should also be testing the presenter event handling.
            // A simple example of testing the events can be found in ListCustomersPresenterTests.
        }

        private class MockAddCustomerView : IAddCustomerView
        {
            private string message;
            public void AttachPresenter(AddCustomerPresenter presenter) { }

            public string Message {
                set { message = value; }
                get { return message; }
            }

            void IAddCustomerView.AttachPresenter(AddCustomerPresenter presenter) { }

            public Customer CustomerToAdd {
                get {
                    return new MockCustomerDao().GetById("NEW_ONE", false);
                }
            }
        }
        
    }
}
