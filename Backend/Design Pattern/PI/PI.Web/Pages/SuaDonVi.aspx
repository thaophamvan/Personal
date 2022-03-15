<%@ Page Title="Sửa đơn vị" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SuaDonVi.aspx.cs" Inherits="PI.Web.Pages.SuaDonVi" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
    <h3>SỬA ĐƠN VỊ</h3>
        <br />
        <table style="width: 320px">
            <tr>
                <td>
                    Thứ tự:</td>
                <td>
                    <asp:TextBox ID="txtTT" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Tên đơn vị:</td>
                <td>
                    <asp:TextBox ID="txtTen" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mô tả đơn vị:</td>
                <td>
                    <asp:TextBox ID="txtMoTa" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Trực theo kíp:</td>
                <td>
                    <asp:CheckBox ID="cbTrucTheoKip" runat="server"></asp:CheckBox></td>
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Sửa" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>

</asp:Content>