using MvpSample.Core.Domain;

namespace MvpSample.Presenters.ViewInterfaces
{
    /// <summary>
    /// There's not much rease to separate this from <see cref="IAddCustomerView" /> other
    /// than for making a more thorough example.  Accordingly, <see cref="AddCustomerPresenter "/>
    /// could be combined with <see cref="EditCustomerPresenter" />.
    /// </summary>
    public interface IEditCustomerView
    {
        Customer CustomerToUpdate { get; set; }
        void AttachPresenter(EditCustomerPresenter presenter);
    }
}
