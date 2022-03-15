<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Employees</title>
</head>
<body>
    <form id="form1" runat="server">
        <div style="width: 350px; text-align: right;">
        <asp:GridView ID="EmployeesGridView" runat="server" AutoGenerateSelectButton="True"
            SelectedIndex="0" AutoGenerateColumns="False" Width="100%">
            <SelectedRowStyle BackColor="#C0FFFF" />
            <Columns>
                <asp:BoundField DataField="Name" HeaderText="Name" />
                <asp:BoundField DataField="BaseSalary" HeaderText="Base Salary" />
                <asp:BoundField DataField="BonusSum" HeaderText="Bonus Sum" />
                <asp:BoundField DataField="TotalPay" HeaderText="Total Pay" />
            </Columns>
        </asp:GridView>
        <asp:Button ID="AwardBonusButton" runat="server" Text="Award Bonus" OnClick="AwardBonusButton_Click" style="margin-top: 10px" />
        </div>
    </form>
</body>
</html>
