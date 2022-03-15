using MvpSample.Core.Domain;

namespace MvpSample.Presenters.ViewInterfaces
{
    /// <summary>
    /// There's not much rease to separate this from <see cref="IEditCustomerView" /> other
    /// than for making a more thorough example.  Accordingly, <see cref="AddCustomerPresenter "/>
    /// could be combined with <see cref="EditCustomerPresenter" />.
    /// </summary>
    public interface IAddCustomerView
    {
        string Message { set; }
        void AttachPresenter(AddCustomerPresenter presenter);

        /// <summary>
        /// No need to have a setter since we're only interested in getting the new 
        /// <see cref="Customer" /> to be added.
        /// </summary>
        Customer CustomerToAdd { get; }
    }
}
