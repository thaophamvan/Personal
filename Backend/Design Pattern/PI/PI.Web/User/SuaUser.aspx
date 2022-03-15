<%@ Page Title="Sửa người dùng" Language="C#"  MasterPageFile="~/Site.Master"  AutoEventWireup="true" CodeBehind="SuaUser.aspx.cs" Inherits="PI.Web.User.SuaUser" %>

<asp:content id="BodyContent" contentplaceholderid="MainContent" runat="server">

  <div>
      <h3>SỬA ĐƠN VỊ</h3>
        <br />
        <table style="width: 320px">
            <tr>
                <td>
                    Tên người dùng: </td>
                <td>
                    <asp:TextBox ID="txtName" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Tên đăng nhập: </td>
                <td>
                    <asp:TextBox ID="txtAccount" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    Mật khẩu: </td>
                <td>
                    <asp:TextBox ID="txtPassword" runat="server"></asp:TextBox></td></td>
            </tr>
            
        </table>
        <br />
        
        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Sửa" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" /></div>

      </div>
    </asp:content>
