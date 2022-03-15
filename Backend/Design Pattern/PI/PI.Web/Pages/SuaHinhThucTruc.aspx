<%@ Page Title="Sửa hình thức trực" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SuaHinhThucTruc.aspx.cs" Inherits="PI.Web.Pages.SuaHinhThucTruc" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
    <h3>SỬA HÌNH THỨC TRỰC</h3>
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
                    Tên hình thức trực:</td>
                <td>
                    <asp:TextBox ID="txtTen" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mô tả hình thức trực:</td>
                <td>
                    <asp:TextBox ID="txtMoTa" runat="server"></asp:TextBox></td>
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Sửa" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>

</asp:Content>