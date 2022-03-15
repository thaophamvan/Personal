<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Orders.aspx.cs" Inherits="Orders" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Orders</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:GridView ID="OrdersGridView" runat="server" OnSelectedIndexChanged="OrdersGridView_SelectedIndexChanged"
            Width="422px" AutoGenerateSelectButton="True" SelectedIndex="0" AutoGenerateColumns="False">
            <Columns>
                <asp:BoundField DataField="State" HeaderText="State" />
            </Columns>
            <SelectedRowStyle BackColor="#C0FFFF" />
        </asp:GridView>
        <asp:Button ID="AcceptOrderBtn" runat="server" OnClick="AcceptOrderBtn_Click" Text="Accept Order" />
        <asp:Button ID="ShipOrderBtn" runat="server" OnClick="ShipOrderBtn_Click" Text="Ship Order" />&nbsp;
        <asp:Button ID="CancelOrderBtn" runat="server" OnClick="CancelOrderBtn_Click" Text="Cancel Order" /><br />
        <asp:Button ID="ShowCustomersButton" runat="server" OnClick="ShowCustomersButton_Click"
            Text="Show Customers" /></div>
    </form>
</body>
</html>
