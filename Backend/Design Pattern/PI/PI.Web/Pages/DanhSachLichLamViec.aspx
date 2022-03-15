<%@ Page Title="Danh mục lịch làm việc" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="DanhSachLichLamViec.aspx.cs" Inherits="PI.Web.Pages.DanhSachLichLamViec" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

   <div>
            <h3>
                DANH MỤC LỊCH LÀM VIỆC</h3>
            
            <asp:GridView ID="GridViewCtr" runat="server" CellPadding="8" ForeColor="#333333" AutoGenerateColumns="False"
                BorderColor="Silver"
                BorderStyle="Solid" BorderWidth="1px">
                <FooterStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                <RowStyle BackColor="#EFF3FB" />
                <PagerStyle BackColor="#2461BF" ForeColor="White" HorizontalAlign="Center" />
                <SelectedRowStyle BackColor="#D1DDF1" Font-Bold="True" ForeColor="#333333" />
                <HeaderStyle BackColor="#507CD1" Font-Bold="True" ForeColor="White" />
                <EditRowStyle BackColor="#2461BF" />
                <AlternatingRowStyle BackColor="White" />
                <Columns>
                    <asp:TemplateField HeaderText="Mã">
                        <ItemTemplate>
                            <asp:Label ID="lbMaItem" runat="server" Text='<%# Bind("Ma") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Người trực">
                        <ItemTemplate>
                            <asp:Label ID="lbTen" runat="server" Text='<%# Bind("NguoiTruc") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                     <asp:TemplateField HeaderText="Đơn vị">
                        <ItemTemplate>
                            <asp:Label ID="lbDonViTrucId" runat="server" Text='<%# Bind("TenDonViTruc") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Mô tả ca trực ngày">
                        <ItemTemplate>
                            <asp:Label ID="lbMoTaTrucNgay" runat="server" Text='<%# Bind("MoTaTrucCaNgay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Mô tả ca trực sáng">
                        <ItemTemplate>
                            <asp:Label ID="lbMoTaTrucSang" runat="server" Text='<%# Bind("MoTaTrucBuoiSang") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Mô tả ca trực chiều">
                        <ItemTemplate>
                            <asp:Label ID="lbMoTaTrucChieu" runat="server" Text='<%# Bind("MoTaTrucBuoiChieu") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Giờ trực sáng">
                        <ItemTemplate>
                            <asp:Label ID="lbGioTrucSang" runat="server" Text='<%# Bind("GioTrucSang") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Giờ trực chiều">
                        <ItemTemplate>
                            <asp:Label ID="lbGioTrucChieu" runat="server" Text='<%# Bind("GioTrucChieu") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Giờ trực cả ngày">
                        <ItemTemplate>
                            <asp:Label ID="lbGioTrucCaNgay" runat="server" Text='<%# Bind("GioTrucCaNgay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Trực cả ngày">
                        <ItemTemplate>
                            <asp:Label ID="lbTrucCaNgay" runat="server" Text='<%# Bind("TrucCaNgay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                       <asp:TemplateField HeaderText="Ngày trực">
                        <ItemTemplate>
                            <asp:Label ID="lbNNgayTruc" runat="server" Text='<%# Bind("NgayTruc") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Người nhập máy">
                        <ItemTemplate>
                            <asp:Label ID="lbNguoiNhapMay" runat="server" Text='<%# Bind("NguoiNhapMay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Ngày nhập máy">
                        <ItemTemplate>
                            <asp:Label ID="lbNgayNhapMay" runat="server" Text='<%# Bind("NgayNhapMay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:HyperLinkField ShowHeader="False" Text="Sửa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/SuaLichLamViec.aspx?id={0}" />
                    <asp:HyperLinkField ShowHeader="False" Text="Xóa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/XoaLichLamViec.aspx?id={0}" />    
                </Columns>
            </asp:GridView>
            &nbsp;&nbsp;&nbsp;
            <br />
            <asp:Button ID="btnThemMoi" runat="server" Text="Thêm mới lịch làm việc" OnClick="btnThemMoi_Click" /><br />
            <br />
            <asp:Label ID="lblResult" runat="server" Text=""></asp:Label></div>

</asp:Content>