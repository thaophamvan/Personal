<%@ Page Title="Thêm mới đơn vị" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ThemMoiDonVi.aspx.cs" Inherits="PI.Web.Pages.ThemMoiDonVi" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
    <h3>THÊM MỚI ĐƠN VỊ</h3>
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
                    Đơn vị:</td>
                <td>
                    <asp:TextBox ID="txtName" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mô tả đơn vị:</td>
                <td>
                    <asp:TextBox ID="txtDescription" runat="server"></asp:TextBox></td>
            </tr>
             <tr>
                <td>
                    Trực theo kíp:</td>
                <td>
                    <asp:CheckBox ID="cbTrucTheoKip" runat="server"></asp:CheckBox></td>
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Thêm" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>
</asp:Content>