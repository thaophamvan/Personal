using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using MVCSharp.Webforms;
using MVCSharp.Examples.TasksInteraction.ApplicationLogic;

public partial class ABAdvancedOptionsView : WebFormView, IABAdvancedOptionsView
{
    protected void OkBtn_Click(object sender, EventArgs e)
    {
        (Controller as ABAdvancedOptionsController).DoEnterOptions();
    }

    public bool IsWorkerOfTheMonth
    {
        get { return WorkerOfTheMonthCB.Checked; }
        set { WorkerOfTheMonthCB.Checked = value; }
    }

    public bool SpecialServices
    {
        get { return SpecialServicesCB.Checked; }
        set { SpecialServicesCB.Checked = value; }
    }
}
