<%@ Page Title="Xóa lịc làm việc" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="XoaLichLamViec.aspx.cs" Inherits="PI.Web.Pages.XoaLichLamViec" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
        <h3>XÓA LỊCH LÀM VIỆC</h3>
      <br/>
        <table style="width: 500px">
         <tr>
                <td>Họ và tên:</td>
                <td>
                    <asp:Label ID="lblHoVaTen" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Đơn vị:</td>
                <td>
                    <asp:Label ID="lblDonViTruc" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Mô tả trực cả ngày:</td>
                <td>
                    <asp:Label ID="lblMoTaTrucCaNgay" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Mô tả trực buổi sáng:</td>
                <td>
                    <asp:Label ID="lblMoTaTrucBuoiSang" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Mô tả trực buổi chiều:</td>
                <td>
                    <asp:Label ID="lblMoTaTrucBuoiChieu" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Giờ trực sáng:</td>
                <td>
                    <asp:Label ID="lblGioTrucSang" runat="server"></asp:Label>
                <td>
            </tr>
            <tr>
                <td>Giờ trực chiều:</td>
                <td>
                    <asp:Label ID="lblGioTrucChieu" runat="server"></asp:Label>
                <td>
            </tr>
             <tr>
                <td>Giờ trực cả ngày:</td>
                <td>
                    <asp:Label ID="lblGioTrucCaNgay" runat="server"></asp:Label>
                <td>
            </tr>
              <tr>
                <td>
                    Trực cả ngày:</td>
                <td>
                    <asp:Label ID="lblTrucCaNgay" runat="server"></asp:Label></td>
            </tr>
               <tr>
                <td>Ngày trực:</td>
                <td>
                    <asp:Label ID="lblNgayTruc" runat="server"></asp:Label>
                <td>
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