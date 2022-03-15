<%@ Page Title="Thêm mới lịch làm việc" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ThemMoiLichLamViec.aspx.cs" Inherits="PI.Web.Pages.ThemMoiLichLamViec" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <h3>THÊM MỚI LỊCH LÀM VIỆC</h3>
        <br />
        <table style="width: 500px">
            <tr>
                <td>Họ và tên:</td>
                <td>
                    <asp:TextBox ID="txtHoVaTen" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Đơn vị:</td>
                <td>
                    <asp:DropDownList ID="ddlDonViTruc" runat="server"></asp:DropDownList></td>
            </tr>
            <tr>
                <td>Mô tả trực cả ngày:</td>
                <td>
                    <asp:TextBox  ID="ltrMoTaTrucCaNgay" Rows="5" columns="29" TextMode="multiline" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Mô tả trực buổi sáng:</td>
                <td>
                    <asp:TextBox ID="ltrMoTaTrucBuoiSang" Rows="5" columns="29" TextMode="multiline" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Mô tả trực buổi chiều:</td>
                <td>
                    <asp:TextBox ID="ltrMoTaTrucBuoiChieu" Rows="5" columns="29" TextMode="multiline" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Giờ trực sáng:</td>
                <td>
                    <asp:TextBox ID="txtGioTrucSang" runat="server"></asp:TextBox>
                <td>
            </tr>
            <tr>
                <td>Giờ trực chiều:</td>
                <td>
                    <asp:TextBox ID="txtGioTrucChieu" runat="server"></asp:TextBox>
                <td>
            </tr>
            <tr>
                <td>Giờ trực cả ngày:</td>
                <td>
                    <asp:TextBox ID="txtGioTrucCaNgay" runat="server"></asp:TextBox>
                <td>
            </tr>
            <tr>
                <td>Trực cả ngày:</td>
                <td>
                    <asp:CheckBox ID="cbTrucCaNgay" runat="server"></asp:CheckBox></td>
            </tr>
            <tr>
                <td>Ngày trực:</td>
                <td>
                    <asp:TextBox ID="txtNgayTruc" runat="server"></asp:TextBox>
                    <img src="/IMG/calender.png" />
                <td>
            </tr>
        </table>
        <br />

        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Thêm" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" />
        <script type="text/javascript">
            $(document).ready(function () {
                $("#<%=txtNgayTruc.ClientID %>").dynDateTime({
                    showsTime: true,
                    ifFormat: "%Y/%m/%d %H:%M",
                    daFormat: "%l;%M %p, %e %m,  %Y",
                    align: "BR",
                    electric: false,
                    singleClick: false,
                    displayArea: ".siblings('.dtcDisplayArea')",
                    button: ".next()"
                });
            });
        </script>
    </div>
</asp:Content>
