<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ListCustomersView.ascx.cs" Inherits="Views_ListCustomersView" %>

<h2>Customer Listing</h2>
<asp:Label ID="lblMessage" runat="server" /> 
<asp:LinkButton Text="Click here" ID="btnAddCustomer" OnClick="btnAddCustomer_OnClick" runat="server" /> to add a new customer.<br />
<br />
<!--
The following GridView includes a hard-coded anchor tag to "EditCustomer.aspx."  For purposes of reuse, you 
may not want the User Control-as-View to know anything about page flow.  If this is needed, you could have 
the ASPX inject a redirect string to the view using setter injection.
-->
<asp:GridView ID="grdEmployees" runat="server" AutoGenerateColumns="false">
    <Columns>
        <asp:TemplateField HeaderText="Customer ID">
            <ItemTemplate>
                <a href="EditCustomer.aspx?customerID=<%# Eval("ID") %>"><%# Eval("ID") %></a>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="CompanyName" HeaderText="Company Name" />
        <asp:BoundField DataField="ContactName" HeaderText="Contact Name" />
    </Columns>
</asp:GridView>
