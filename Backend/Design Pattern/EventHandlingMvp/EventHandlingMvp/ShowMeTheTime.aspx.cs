using System;
using System.Web.UI;

public partial class ShowMeTheTime : Page
{
    protected void Page_Load(object sender, EventArgs e) {
        InitCurrentTimeView();
    }

    private void InitCurrentTimeView() {
        CurrentTimePresenter presenter = new CurrentTimePresenter(currentTimeView);
        currentTimeView.AttachPresenter(presenter);
        presenter.InitView(IsPostBack);
    }
}