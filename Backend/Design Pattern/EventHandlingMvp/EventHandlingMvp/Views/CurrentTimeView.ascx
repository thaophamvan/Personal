<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CurrentTimeView.ascx.cs" Inherits="Views_CurrentTimeView" %>

<asp:Label id="lblMessage" runat="server" /><br />
<asp:Label id="lblCurrentTime" runat="server" /><br />
<br />
<asp:TextBox id="txtNumberOfDays" runat="server" />
<asp:RequiredFieldValidator ID="RequiredFieldValidator1" ControlToValidate="txtNumberOfDays" runat="server"
	ErrorMessage="Number of days is required" ValidationGroup="AddDays" />
<asp:CompareValidator ID="CompareValidator1" ControlToValidate="txtNumberOfDays" runat="server"
	Operator="DataTypeCheck" Type="Double" ValidationGroup="AddDays"
	ErrorMessage="Number of days must be numeric" /><br />
<br />
<asp:Button id="btnAddDays" Text="Add Days" runat="server" OnClick="btnAddDays_OnClick" ValidationGroup="AddDays" />