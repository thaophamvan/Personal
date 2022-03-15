<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ABMainView.aspx.cs" Inherits="ABMainView" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Award Bonus</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table cellpadding="3">
            <tr>
                <td>
        <asp:Label ID="ContractsLbl" runat="server" Text="Contracts Made"></asp:Label></td>
                <td style="text-align: right">
        <asp:TextBox ID="ContractsTextBox" runat="server" Width="28px">0</asp:TextBox></td>
            </tr>
            <tr>
                <td>
        <asp:Label ID="CustomersLbl" runat="server" Text="Customers Attracted"></asp:Label></td>
                <td style="text-align: right">
        <asp:TextBox ID="CustomersTextBox" runat="server" Width="28px">0</asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    <asp:LinkButton ID="AdvancedLinkBtn" runat="server" OnClick="AdvancedLinkBtn_Click">Advanced Options</asp:LinkButton></td>
                <td>
                </td>
            </tr>
            <tr>
                <td>
                </td>
                <td>
                    <asp:Button ID="OkButton" runat="server" Text="OK" Width="65px" OnClick="OkButton_Click" /></td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
