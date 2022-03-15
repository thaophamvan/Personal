<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ABAdvancedOptionsView.aspx.cs" Inherits="ABAdvancedOptionsView" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Advanced Options</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:CheckBox ID="WorkerOfTheMonthCB" runat="server" Text="Worker Of The Month" />
        <br />
        <asp:CheckBox ID="SpecialServicesCB" runat="server" Text="Special Services" />
        <div style="width: 200px; text-align: right; margin-top: 10px;">
            <asp:Button ID="OkBtn" runat="server" Text="OK" Width="68px" OnClick="OkBtn_Click" /></div>
    </div>
    </form>
</body>
</html>
