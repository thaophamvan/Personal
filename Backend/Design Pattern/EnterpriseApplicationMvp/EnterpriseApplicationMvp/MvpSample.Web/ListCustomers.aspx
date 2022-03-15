<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ListCustomers.aspx.cs" Inherits="ListCustomers" %>
<%@ Register TagPrefix="mvp" TagName="ListCustomersView" Src="./Views/ListCustomersView.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>List Customers</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <mvp:ListCustomersView ID="listCustomersView" runat="server" />
    </div>
    </form>
</body>
</html>
