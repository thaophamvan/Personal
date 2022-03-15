using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using MVCSharp.Webforms;
using MVCSharp.Examples.TasksInteraction.ApplicationLogic;
using MVCSharp.Examples.TasksInteraction.Model;

public partial class _Default : WebFormView, IEmployeesView
{
    public void SetEmployeesList(List<Employee> employees)
    {
        EmployeesGridView.DataSource = employees;
    }

    public Employee CurrentEmployee
    {
        get
        {
            return (EmployeesGridView.DataSource as List<Employee>)
                                  [EmployeesGridView.SelectedIndex];
        }
        set
        {
            EmployeesGridView.SelectedIndex =
             (EmployeesGridView.DataSource as IList).IndexOf(value);
        }
    }

    protected void AwardBonusButton_Click(object sender, EventArgs e)
    {
        (Controller as EmployeesController).AwardBounus();
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        DataBind();
    }
}
