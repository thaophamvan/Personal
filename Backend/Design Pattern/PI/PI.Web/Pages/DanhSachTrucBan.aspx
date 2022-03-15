<%@ Page Title="Danh sách trực ban" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="DanhSachTrucBan.aspx.cs" Inherits="PI.Web.Pages.DanhSachTrucBan" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

   <div>
            <h3>
                DANH SÁCH TRỰC BAN</h3>
            
            <asp:GridView ID="GridViewCtr" runat="server" CellPadding="8" ForeColor="#333333" AutoGenerateColumns="False"
                OnRowCancelingEdit="GridViewCtr_RowCancelingEdit"
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
                    <asp:TemplateField HeaderText="Họ và tên">
                        <ItemTemplate>
                            <asp:Label ID="lbTen" runat="server" Text='<%# Bind("HoVaTen") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Đơn vị">
                        <ItemTemplate>
                            <asp:Label ID="lbDonVi" runat="server" Text='<%# Bind("DonVi") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Cấp bậc">
                        <ItemTemplate>
                            <asp:Label ID="lbCapBac" runat="server" Text='<%# Bind("CapBac") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Chức vụ">
                        <ItemTemplate>
                            <asp:Label ID="lbChucVu" runat="server" Text='<%# Bind("ChucVu") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Hình thức trực">
                        <ItemTemplate>
                            <asp:Label ID="lbHinhThucTruc" runat="server" Text='<%# Bind("HinhThucTruc") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Từ ngày">
                        <ItemTemplate>
                            <asp:Label ID="lbThoiGianTu" runat="server" Text='<%# Bind("ThoiGianTu") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Đến ngày">
                        <ItemTemplate>
                            <asp:Label ID="lbThoiGianDen" runat="server" Text='<%# Bind("ThoiGianDen") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Kíp trực">
                        <ItemTemplate>
                            <asp:Label ID="lbKipTruc" runat="server" Text='<%# Bind("KipTruc") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                     <asp:TemplateField HeaderText="Ca trực">
                        <ItemTemplate>
                            <asp:Label ID="lbCaTruc" runat="server" Text='<%# Bind("CaTruc") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Người nhập">
                        <ItemTemplate>
                            <asp:Label ID="lbNguoiNhapMay" runat="server" Text='<%# Bind("NguoiNhapMay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Ngày nhập">
                        <ItemTemplate>
                            <asp:Label ID="lbNgayNhapMay" runat="server" Text='<%# Bind("NgayNhapMay") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    
                    <asp:HyperLinkField ShowHeader="False" Text="Sửa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/SuaTrucBan.aspx?id={0}" />
                    <asp:HyperLinkField ShowHeader="False" Text="Xóa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/XoaTrucBan.aspx?id={0}" />    
                    
                    
                </Columns>
            </asp:GridView>
            &nbsp;&nbsp;&nbsp;
            <br />
            <asp:Button ID="btnThemMoi" runat="server" Text="Thêm mới trực ban" OnClick="btnThemMoi_Click" /><br />
            <br />
            <asp:Label ID="lblResult" runat="server" Text=""></asp:Label></div>

</asp:Content>