<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ShowMeTheTime.aspx.cs" Inherits="ShowMeTheTime" %>
<%@ Register TagPrefix="mvpProject" TagName="CurrentTimeView" Src="./Views/CurrentTimeView.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Show Me the Time!</title>
</head>
<body>
    <form id="form1" runat="server">
        <mvpProject:CurrentTimeView id="currentTimeView" runat="server" />
    </form>
</body>
</html>
