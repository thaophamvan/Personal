<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Customers</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:GridView ID="CustomersGridView" runat="server" OnSelectedIndexChanged="CustomersGridView_SelectedIndexChanged" AutoGenerateSelectButton="True" SelectedIndex="0">
            <SelectedRowStyle BackColor="#C0FFFF" />
        </asp:GridView>
        <asp:Button ID="ShowOrdersButton" runat="server" OnClick="ShowOrdersButton_Click"
            Text="Show Orders" /></div>
    </form>
</body>
</html>
