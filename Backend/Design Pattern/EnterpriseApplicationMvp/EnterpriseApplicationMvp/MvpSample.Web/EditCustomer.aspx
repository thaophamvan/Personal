<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EditCustomer.aspx.cs" Inherits="EditCustomer" %>
<%@ Register TagPrefix="mvp" TagName="EditCustomerView" Src="./Views/EditCustomerView.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Edit Customer</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <mvp:EditCustomerView ID="editCustomerView" runat="server" />
    </div>
    </form>
</body>
</html>
