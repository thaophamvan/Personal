using System;
using System.Web.UI;

public partial class Views_CurrentTimeView : UserControl, ICurrentTimeView
{
    public void AttachPresenter(CurrentTimePresenter presenter) {
        if (presenter == null) throw new ArgumentNullException("presenter may not be null");

        this.presenter = presenter;
    }

    public string Message {
        set { lblMessage.Text = value; }
    }

    public DateTime CurrentTime {
        set { lblCurrentTime.Text = value.ToString(); }
    }

    protected void btnAddDays_OnClick(object sender, EventArgs e) {
        if (presenter == null) throw new FieldAccessException("presenter has not yet been initialized");

        presenter.AddDays(txtNumberOfDays.Text, Page.IsValid);
    }

    private CurrentTimePresenter presenter;
}
