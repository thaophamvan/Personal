<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AddCustomer.aspx.cs" Inherits="AddCustomer" %>
<%@ Register TagPrefix="mvp" TagName="AddCustomerView" Src="./Views/AddCustomerView.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Add Customer</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <mvp:AddCustomerView ID="addCustomerView" runat="server" />
    </div>
    </form>
</body>
</html>
