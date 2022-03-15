<%@ Application Language="C#" %>
<%@ Import Namespace="MVCSharp.Core.Tasks" %>
<%@ Import Namespace="MVCSharp.Webforms" %>
<%@ Import Namespace="MVCSharp.Webforms.Configuration" %>
<%@ Import Namespace="MVCSharp.Examples.TasksInteraction.ApplicationLogic" %>
<%@ Import Namespace="MVCSharp.Examples.TasksInteraction.Model" %>

<script runat="server">

    [WebformsView(typeof(MainTask), MainTask.Employees, "Default.aspx")]
    [WebformsView(typeof(AwardBonusTask), AwardBonusTask.MainView, "ABMainView.aspx")]
    [WebformsView(typeof(AwardBonusTask), AwardBonusTask.AdvancedOptionsView, "ABAdvancedOptionsView.aspx")]
    class ViewDescriptions { }

    void Session_Start(object sender, EventArgs e)
    {
        CreateTestData();
        TasksManager tm = new TasksManager(WebformsViewsManager.
                                           GetDefaultConfig());
        tm.StartTask(typeof(MainTask));
    }

    private static void CreateTestData()
    {
        Employee.AllInstances.Clear();
        Employee.AllInstances.Add(new Employee("John", 30000));
        Employee.AllInstances.Add(new Employee("Pete", 20000));
        Employee.AllInstances.Add(new Employee("Andy", 25000));
    } 
       
</script>
