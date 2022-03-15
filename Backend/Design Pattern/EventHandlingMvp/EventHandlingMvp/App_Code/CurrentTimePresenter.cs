using System;

/// <summary>
/// This is the Presenter. In reality, Presenters should be in there own ".Presenters" assembly 
/// for maintaining proper separation of concerns.  This Presenter has been included in the 
/// same project as the web application for illustrative purpuses.
/// </summary>
public class CurrentTimePresenter 
{
	public CurrentTimePresenter(ICurrentTimeView view) {
		if (view == null) throw new ArgumentNullException("view may not be null");

		this.view = view;
	}

	public void InitView(bool isPostBack) {
		if (! isPostBack) {
			view.CurrentTime = DateTime.Now;
		}
	}

	public void AddDays(string daysUnparsed, bool isPageValid) {
		if (isPageValid) {
			view.CurrentTime = DateTime.Now.AddDays(double.Parse(daysUnparsed));
		}
		else {
			view.Message = "Bad inputs...no updated date for you!";
		}
	}

	private ICurrentTimeView view;
}

