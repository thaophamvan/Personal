using System.Collections.Generic;
using MvpSample.Core.Domain;

namespace MvpSample.Presenters.ViewInterfaces
{
    public interface IListCustomersView
    {
        string Message { set; }
        IList<Customer> Customers { set; }
        void AttachPresenter(ListCustomersPresenter presenter);
    }
}
