<%@ Page Title="Thêm mới hình thức trực" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ThemMoiHinhThucTruc.aspx.cs" Inherits="PI.Web.Pages.ThemMoiHinhThucTruc" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
    <h3>THÊM MỚI HÌNH THỨC TRỰC</h3>
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
                    Hình thức trực:</td>
                <td>
                    <asp:TextBox ID="txtName" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mô tả hình thức trực:</td>
                <td>
                    <asp:TextBox ID="txtDescription" runat="server"></asp:TextBox></td>
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Thêm" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>
</asp:Content>