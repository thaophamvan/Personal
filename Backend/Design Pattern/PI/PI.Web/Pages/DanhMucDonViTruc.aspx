<%@ Page Title="Danh mục đơn vị trực" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="DanhMucDonViTruc.aspx.cs" Inherits="PI.Web.Pages.DanhMucDonViTruc" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

   <div>
            <h3>
                DANH MỤC ĐƠN VỊ TRỰC</h3>
            
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
                    <asp:TemplateField HeaderText="Mã đơn vị trực">
                        <ItemTemplate>
                            <asp:Label ID="lbMaItem" runat="server" Text='<%# Bind("Ma") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Tên đơn vị trực">
                        <ItemTemplate>
                            <asp:Label ID="lbTen" runat="server" Text='<%# Bind("Ten") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Mô tả đơn vị trực">
                        <ItemTemplate>
                            <asp:Label ID="lbMoTa" runat="server" Text='<%# Bind("MoTa") %>'></asp:Label>
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
                    <asp:HyperLinkField ShowHeader="False" Text="Sửa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/SuaDonViTruc.aspx?id={0}" />
                    <asp:HyperLinkField ShowHeader="False" Text="Xóa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/XoaDonViTruc.aspx?id={0}" />    
                </Columns>
            </asp:GridView>
            &nbsp;&nbsp;&nbsp;
            <br />
            <asp:Button ID="btnThemMoi" runat="server" Text="Thêm mới đơn vị trực" OnClick="btnThemMoi_Click" /><br />
            <br />
            <asp:Label ID="lblResult" runat="server" Text=""></asp:Label></div>

</asp:Content>