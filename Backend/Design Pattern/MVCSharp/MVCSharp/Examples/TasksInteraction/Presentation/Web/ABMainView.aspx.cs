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

public partial class ABMainView : WebFormView, IABMainView
{
    protected void AdvancedLinkBtn_Click(object sender, EventArgs e)
    {
        (Controller as ABMainController).ShowAdvancedOptions();
    }
    protected void OkButton_Click(object sender, EventArgs e)
    {
        (Controller as ABMainController).DoAwardBonus();
    }

    public int ContractsMade
    {
        get { return Convert.ToInt32(ContractsTextBox.Text); }
        set { ContractsTextBox.Text = value.ToString(); }
    }

    public int CustomersAttracted
    {
        get { return Convert.ToInt32(CustomersTextBox.Text); }
        set { CustomersTextBox.Text = value.ToString(); }
    }
}
