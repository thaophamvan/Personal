<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default .aspx.cs" Inherits="MVP.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <table>
                <tr>
                    <th colspan="2">Calculate Area of Circle</th>
                </tr>
                <tr>
                    <td>Enter Radius</td>
                    <td>
                        <asp:TextBox ID="TextRadius" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>Result:</td>
                    <td>
                        <asp:Label ID="LabelResult" runat="server" ForeColor="red"></asp:Label></td>
                </tr>
                <tr align="right">
                    <td colspan="2">
                        <asp:Button ID="ButtonResult" runat="server" Text="Get Area?" OnClick="ButtonResult_Click" /></td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>
