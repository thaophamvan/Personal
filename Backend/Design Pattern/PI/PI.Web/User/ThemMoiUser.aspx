<%@ Page Title="Thêm mới người dùng" MasterPageFile="~/Site.Master" Language="C#" AutoEventWireup="true" CodeBehind="ThemMoiUser.aspx.cs" Inherits="PI.Web.User.ThemMoiUser" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
    <h3>THÊM MỚI NGƯỜI DÙNG</h3>
        <br />
        <table style="width: 320px">            
            <tr>
                <td>
                    Tên người dùng</td>
                <td>
                    <asp:TextBox ID="txtName" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Tên đăng nhập</td>
                <td>
                    <asp:TextBox ID="txtAccount" runat="server"></asp:TextBox></td>
            </tr>
             <tr>
                <td>
                    Mật khẩu</td>
                <td>
                    <input type="password" runat ="server" id="txtPassword" />
            </tr>
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Thêm" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>
    <asp:Label runat="server" ID="lblThongbao" Text=""></asp:Label>
</asp:Content>
