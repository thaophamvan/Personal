<%@ Page Title="Thêm mới cấp bậc" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ThemMoiCapBac.aspx.cs" Inherits="PI.Web.Pages.ThemMoiCapBac" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
    <h3>
                THÊM MỚI CẤP BẬC</h3>
        <br />
        <table style="width: 320px">
            <tr>
                <td>
                    Tên cấp bậc:</td>
                <td>
                    <asp:TextBox ID="txtName" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mô tả cấp bậc:</td>
                <td>
                    <asp:TextBox ID="txtDescription" runat="server"></asp:TextBox></td>
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Thêm" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>
</asp:Content>