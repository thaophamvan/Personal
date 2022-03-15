<%@ Page Title="Xóa đơn vị trực" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="XoaDonViTruc.aspx.cs" Inherits="PI.Web.Pages.XoaDonViTruc" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
        <h3>XÓA ĐƠN VỊ TRỰC</h3>
      <br/>
        <table style="width: 320px">
            <tr>
                <td>
                    Mã đơn vị trực:</td>
                <td>
                    <asp:Label ID="lblMa" runat="server" Font-Bold="True" Text=""></asp:Label></td>
            </tr>
            <tr>
                <td>
                    Tên đơn vị trực:</td>
                <td>
                    <asp:Label ID="lblTen" runat="server" Font-Bold="True" Text=""></asp:Label></td>
            </tr>
            <tr>
                <td>
                    Môt tả đơn vị trực:</td>
                <td>
                    <asp:Label ID="lblMoTa" runat="server" Font-Bold="True" Text=""></asp:Label></td>
            </tr>
            <tr>
                <td>
                    Người nhập máy:</td>
                <td>
                    <asp:Label ID="lblNguoINhapMay" runat="server" Font-Bold="True" Text=""></asp:Label></td>
            </tr>
            <tr>
                <td>
                    Ngày nhập máy:</td>
                <td>
                    <asp:Label ID="lblNgayNhapMay" runat="server" Font-Bold="True" Text=""></asp:Label></td>
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