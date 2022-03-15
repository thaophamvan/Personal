using System;

/// <summary>
/// This is the View Inteface.  In reality, View Interfaces should belong in the same assembly
/// as the Presenters; e.g. the ".Presenters" assembly.
/// </summary>
public interface ICurrentTimeView
{
    DateTime CurrentTime { set; }
    string Message { set; }
    void AttachPresenter(CurrentTimePresenter presenter);
}
