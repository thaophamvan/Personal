<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ThemMoiTrucBan.aspx.cs" Inherits="PI.Web.Pages.ThemMoiTrucBan" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <h3>THÊM MỚI TRỰC BAN</h3>
        <br />
        <table style="width: 320px">
            <tr>
                <td>Họ và tên:</td>
                <td>
                    <asp:TextBox ID="txtHoVaTen" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Đơn vị:</td>
                <td>
                    <asp:DropDownList ID="ddlDonVi" runat="server"></asp:DropDownList></td>
            </tr>
            <tr>
                <td>Cấp bậc:</td>
                <td>
                    <asp:DropDownList ID="ddlCapBac" runat="server"></asp:DropDownList></td>
            </tr>
            <tr>
                <td>Chức vụ:</td>
                <td>
                    <asp:DropDownList ID="ddlChucVu" runat="server"></asp:DropDownList></td>
            </tr>
            <tr>
                <td>Hình thức trực:</td>
                <td>
                    <asp:DropDownList ID="ddlHinhThucTruc" runat="server"></asp:DropDownList></td>
            </tr>

            <tr>
                <td>Từ ngày:</td>
                <td>
                    <asp:TextBox ID="txtTuNgay" runat="server"></asp:TextBox>
                    <img src="/IMG/calender.png" />
                <td>
            </tr>
            <tr>
                <td>Đến ngày:</td>
                <td>
                    <asp:TextBox ID="txtDenNgay" runat="server"></asp:TextBox>
                    <img src="/IMG/calender.png" />
                <td>
            </tr>
            <tr>
                <td>Ca trực:</td>
                <td>
                    <asp:DropDownList ID="ddCaTruc" runat="server"></asp:DropDownList></td>
            </tr>
            <tr>
                <td>Kíp trực:</td>
                <td>
                    <asp:TextBox ID="txtKipTruc" runat="server"></asp:TextBox></td>
            </tr>
        </table>
        <br />

        <asp:Button ID="btnYES" runat="server" OnClick="btnYES_Click" Text="Thêm" />
        &nbsp; &nbsp;
        <asp:Button ID="btnNO" runat="server" OnClick="btnNO_Click" Text="Hủy" />
        <script type="text/javascript">
            $(document).ready(function () {
                $("#<%=txtTuNgay.ClientID %>").dynDateTime({
            showsTime: true,
            ifFormat: "%Y/%m/%d %H:%M",
            daFormat: "%l;%M %p, %e %m,  %Y",
            align: "BR",
            electric: false,
            singleClick: false,
            displayArea: ".siblings('.dtcDisplayArea')",
            button: ".next()"
        });
        $("#<%=txtDenNgay.ClientID %>").dynDateTime({
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
