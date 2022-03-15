<%@ Application Language="C#" %>
<%@ Import Namespace="MVCSharp.Core.Tasks" %>
<%@ Import Namespace="MVCSharp.Webforms" %>
<%@ Import Namespace="MVCSharp.Webforms.Configuration" %>
<%@ Import Namespace="MVCSharp.Examples.Basics.ApplicationLogic" %>
<%@ Import Namespace="MVCSharp.Examples.Basics.Model" %>

<script runat="server">

    [WebformsView(typeof(MainTask), MainTask.Customers, "Default.aspx")]
    [WebformsView(typeof(MainTask), MainTask.Orders, "Orders.aspx")]
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
        Customer.AllCustomers.Clear();
            
        Customer.AllCustomers.Add(new Customer("John"));
        Customer.AllCustomers.Add(new Customer("Paul"));

        Customer.AllCustomers[0].Orders.Add(new Order());
        Customer.AllCustomers[0].Orders.Add(new Order());
        Customer.AllCustomers[0].Orders.Add(new Order());

        Customer.AllCustomers[1].Orders.Add(new Order());
        Customer.AllCustomers[1].Orders.Add(new Order());
    }    
      
</script>
