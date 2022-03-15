<%@ Page Title="Sửa cấp bậc" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SuaCapBac.aspx.cs" Inherits="PI.Web.Pages.SuaCapBac" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
    <h3>SỬA CẤP BẬC</h3>
        <br />
        <table style="width: 320px">
            <tr>
                <td>
                    Tên cấp bậc:</td>
                <td>
                    <asp:TextBox ID="txtTen" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mô tả cấp bậc:</td>
                <td>
                    <asp:TextBox ID="txtMoTa" runat="server"></asp:TextBox></td>
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Sửa" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>

</asp:Content>