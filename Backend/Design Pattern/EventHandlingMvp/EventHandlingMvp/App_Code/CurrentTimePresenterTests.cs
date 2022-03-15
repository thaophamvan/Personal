using System;
using NUnit.Framework;

/// <summary>
/// This is unit test class for testing the InitView method of <see cref="CurrentTimePresenter" />.
/// In reality, unit tests should be in there own ".Tests" assembly for ease of testing 
/// and so that the unit tests do not get deployed with the project.  This unit test 
/// has been included in the same project for illustrative purpuses.
/// </summary>
[TestFixture]
public class CurrentTimePresenterTests
{
    [Test]
    public void TestInitView() {
        MockCurrentTimeView view = new MockCurrentTimeView();
        CurrentTimePresenter presenter = new CurrentTimePresenter(view);
        presenter.InitView(false);

        Assert.IsTrue(view.CurrentTime > DateTime.MinValue);
    }

    private class MockCurrentTimeView : ICurrentTimeView
    {
        public DateTime CurrentTime {
            set { currentTime = value; }

            // This getter isn't required by ICurrentTimeView,
            // but it allows us to unit test its value.
            get { return currentTime; }
        }

        public string Message {
            set { }
        }

        public void AttachPresenter(CurrentTimePresenter presenter) { }

        private DateTime currentTime = DateTime.MinValue;
    }
}