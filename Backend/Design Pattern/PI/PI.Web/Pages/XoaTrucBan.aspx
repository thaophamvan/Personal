<%@ Page Title="Xóa trực ban" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="XoaTrucBan.aspx.cs" Inherits="PI.Web.Pages.XoaTrucBan" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

  <div>
        <h3>XÓA TRỰC BAN</h3>
      <br/>
        <table style="width: 320px">
            <tr>
                <td>Thứ tự:</td>
                <td>
                    <asp:Label ID="LabelThuTu" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Họ và tên:</td>
                <td>
                    <asp:Label ID="LabelHoVaTen" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Đơn vị:</td>
                <td>
                    <asp:Label ID="LabelDonVi" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Cấp bậc:</td>
                <td>
                    <asp:Label ID="LabelCapBac" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Chức vụ:</td>
                <td>
                    <asp:Label ID="LabelChucVu" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>Hình thức trực:</td>
                <td>
                    <asp:Label ID="LabelHinhThucTruc" runat="server"></asp:Label></td>
            </tr>
        
              <tr>
                <td>
                    Từ ngày:</td>
                <td>
                    <asp:Label ID="LabelTuNgay" runat="server" ReadOnly = "true"></asp:Label>
                    <img src="/IMG/calender.png" />
            </tr>
             <tr>
                <td>
                    Đến ngày:</td>
                <td>
                    <asp:Label ID="LabelDenNgay" runat="server" ReadOnly = "true"></asp:Label>
                    <img src="/IMG/calender.png" />
            </tr>
            <tr>
                <td>
                    Ca trực:</td>
                <td>
                    <asp:Label ID="LabelCaTruc" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td>
                    Kíp trực:</td>
                <td>
                    <asp:Label ID="LabelKipTruc" runat="server"></asp:Label></td>
            </tr>
        </table>
        <br />       
    
    </div>
        <br />
        Ban có chắc chắn muốn xóa không?: &nbsp; &nbsp;
        <asp:Button ID="btnYES" runat="server" Text="Xóa" OnClick="btnYES_Click" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" Text="Không" OnClick="btnNO_Click" /><br />
        <br />
        &nbsp;&nbsp;

</asp:Content>