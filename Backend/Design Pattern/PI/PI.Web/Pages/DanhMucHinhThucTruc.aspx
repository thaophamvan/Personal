<%@ Page Title="Danh mục hình thức trực" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="DanhMucHinhThucTruc.aspx.cs" Inherits="PI.Web.Pages.DanhMucHinhThucTruc" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

   <div>
            <h3>
                Danh mục hình thức trực</h3>
            
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
                    <asp:TemplateField HeaderText="Mã hình thức trực">
                        <ItemTemplate>
                            <asp:Label ID="lbMaItem" runat="server" Text='<%# Bind("Ma") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                      <asp:TemplateField HeaderText="Thứ tự">
                        <ItemTemplate>
                            <asp:Label ID="lbTTItem" runat="server" Text='<%# Bind("TT") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Tên hình thức trực">
                        <ItemTemplate>
                            <asp:Label ID="lbTen" runat="server" Text='<%# Bind("Ten") %>'></asp:Label>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:TemplateField HeaderText="Mô tả Đơn vị">
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
                    
                    <asp:HyperLinkField ShowHeader="False" Text="Sửa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/SuaHinhThucTruc.aspx?id={0}" />
                    <asp:HyperLinkField ShowHeader="False" Text="Xóa" DataNavigateUrlFields="Ma" DataNavigateUrlFormatString="~/Pages/XoaHinhThucTruc.aspx?id={0}" />    
                    
                    
                </Columns>
            </asp:GridView>
            &nbsp;&nbsp;&nbsp;
            <br />
            <asp:Button ID="btnThemMoi" runat="server" Text="Thêm mới hình thức trực" OnClick="btnThemMoi_Click" /><br />
            <br />
            <asp:Label ID="lblResult" runat="server" Text=""></asp:Label></div>

</asp:Content>