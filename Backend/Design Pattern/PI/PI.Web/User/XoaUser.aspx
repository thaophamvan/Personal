<%@ Page Title="Xóa người dùng" MasterPageFile="~/Site.Master" Language="C#" AutoEventWireup="true" CodeBehind="XoaUser.aspx.cs" Inherits="PI.Web.User.XoaUser" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
        <h3>XÓA ĐƠN VỊ</h3>
      <br/>
        <table style="width: 320px">
            <tr>
                <td>
                    Tên người dùng</td>
                <td>
                    <asp:Label ID="lblName" runat="server" Font-Bold="True" Text=""></asp:Label></td>
            </tr>
            <tr>
                <td>
                    Tên đăng nhập:</td>
                <td>
                    <asp:Label ID="lblAccount" runat="server" Font-Bold="True" Text=""></asp:Label></td>
            </tr>            
        </table>
    
    </div>
        <br />
        Ban có chắc chắn muốn xóa không?: &nbsp; &nbsp;
        <asp:Button ID="btnYES" runat="server" Text="Xóa" OnClick="btnYES_Click" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" Text="Không" OnClick="btnNO_Click" /><br />
        <br />
        &nbsp;&nbsp;

</asp:Content>