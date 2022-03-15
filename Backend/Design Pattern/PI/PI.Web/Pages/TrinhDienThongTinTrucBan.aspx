<%@ Page Title="Danh muc chức vụ" Language="C#" MasterPageFile="~/SiteSlide.Master" AutoEventWireup="true" CodeBehind="TrinhDienThongTinTrucBan.aspx.cs" Inherits="PI.Web.Pages.TrinhDienThongTinTrucBan" %>

<%@ Import Namespace="PI.Common.StringUlti" %>

<asp:Content ID="HeadContentCtr" ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="../Content/trucban.css">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContentFullScreen" runat="server">
    <div class="header-slide">
        <div class="header-text">TỔNG HỢP</div>
        <div class="header-sub-text">Trực chỉ huy, trực ban cơ quan, đơn vị BTM và TCHC</div>
        <div class="header-date">
            Từ ngày 18/5/2015 đến ngày 25/5/2015
        </div>
    </div>
    <!-- Swiper -->
    <div class="swiper-container">

        <div class="swiper-wrapper">

            <div class="swiper-slide pos-relative">
                <div class="block-slide">
                    <div class="ten-donvi">I. TRỰC CHỈ HUY TỔNG CỤC</div>
                    <div class="ten-nguoitruc">Thiếu tướng Ngô Minh R - Phó chủ nhiệm Tổng cụ</div>
                </div>
            </div>
            <% foreach (var donvi in DanhMucDonVi())
               {%>
            <div class="swiper-slide pos-relative">
                <div class="block-slide">
                    <div class="ten-donvi"><%=donvi.TT.ToRomanNumeral() %>. <%= donvi.Ten %></div>
                    <%if (!donvi.TrucTheoKip)
                      { %>
                    <% foreach (var hinhthuctruc in DanhMucHinhThucTruc())
                       {%>
                    <div class="ten-hinhthuctruc"><%=hinhthuctruc.TT %>. <%= hinhthuctruc.Ten %></div>
                    <table>
                        <tr>
                            <th rowspan="2">TT</th>
                            <th rowspan="2">Họ và tên</th>
                            <th rowspan="2">Cấp bậc</th>
                            <th rowspan="2">Chức vụ</th>
                            <th colspan="2" rowspan="1">Thời gian</th>
                        </tr>
                        <tr>
                            <td>Từ 7.30</td>
                            <td>Đến 7.30</td>
                        </tr>
                        <% index = 0;%>
                        <% foreach (var trucban in LocDanhSachTrucBan(donvi.Ma, hinhthuctruc.Ma))
                           {%>
                        <% index++;%>
                        <!-- Lặp danh sách-->
                        <tr>
                            <td><% =index.ToString().Contains("0") ? index.ToString() : "0" + index %></td>
                            <td><%= trucban.HoVaTen %></td>
                            <td><%= trucban.CapBac.Ten %></td>
                            <td><%= trucban.ChucVu.Ten %></td>
                            <td><%= trucban.ThoiGianTu.ToString("dd/MM/yyyy") %></td>
                            <td><%= trucban.ThoiGianDen.ToString("dd/MM/yyyy") %></td>
                        </tr>
                        <% } %>
                    </table>
                    <% } %>
                    <% }
                      else
                      { %>
                      <% foreach (var hinhthuctruc in DanhMucHinhThucTruc())
                       {%>
                            <div class="ten-hinhthuctruc"><%=hinhthuctruc.TT %>. <%= hinhthuctruc.Ten %></div>
                            <table>
                                    <tr>
                                        <th>TT</th>
                                        <th>Họ và tên</th>
                                        <th>Cấp bậc</th>
                                        <th>Chức vụ</th>
                                        <th>Thời gian</th>
                                        <th>Ghi chú</th>
                                    </tr>
                            <% index = 0;%>
                            <% for (int d = 0; d < LocDanhSachTrucBan(donvi.Ma, hinhthuctruc.Ma).Count()/2; d++)
                               {%>
                               <% index++;%>
                                <%var trucban = LocDanhSachTrucBan(donvi.Ma, hinhthuctruc.Ma)[d]; %>
                                <%var trucban1 = LocDanhSachTrucBan(donvi.Ma, hinhthuctruc.Ma)[d+1]; %>
                                    <!-- Lặp danh sách-->
                                    <tr>
                                        <td><div><% =index.ToString().Contains("0") ? index.ToString() : "0" + index%></div>
                                            <div><% =(index +1).ToString().Contains("0") ? index.ToString() : "0" + (index +1)%></div>
                                        </td>
                                        <td><div><%= trucban.HoVaTen%></div>
                                            <div><%= trucban1.HoVaTen%></div>
                                        </td>
                                        <td><div><%= trucban.CapBac.Ten%></div>
                                            <div><%= trucban1.CapBac.Ten%></div>
                                        </td>
                                        <td><div><%= trucban.ChucVu.Ten%></div>
                                            <div><%= trucban1.ChucVu.Ten%></div>
                                        </td>
                                        <td><div><%= trucban.ThoiGianTu.ToString("dd/MM/yyyy")%></div>
                                            <div><%= trucban1.ThoiGianTu.ToString("dd/MM/yyyy")%></div>
                                        </td>
                                        <td><div><%= trucban.CaTruc%></div>
                                            <div><%= trucban1.CaTruc%></div>
                                        </td>
                                    </tr>
                            <% } %>
                            </table>
                    <% } %>
                    <% } %>
                </div>
            </div>
            <% } %>



            <%--          <div class="ten-hinhthuctruc">1. Trực chỉ huy
                </div>
                <div class="vung-trucchihuy">
                <table class="bang-trucchihuy">
                    <tr>
                        <th rowspan="2">TT</th>
                        <th rowspan="2">Họ và tên</th>
                        <th rowspan="2">Cấp bậc</th>
                        <th rowspan="2">Chức vụ</th>
                        <th colspan="2" rowspan="1">Thời gian</th>
                    </tr>
                    <tr>
                        <td>Từ 7.30</td>
                        <td>Đến Từ 7.30</td>
                    </tr>
                    <!-- Lặp danh sách-->
                    <tr>
                        <td>01</td>
                        <td>Nguyễn quang Z</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                </table>
                </div>
                <div class="ten-hinhthuctruc">2. Trực ban tác chiến
                </div>
                <div class="vung-tructacchien">
                <table class="bang-trucbantacchien">
                    <tr>
                        <th rowspan="2">TT</th>
                        <th rowspan="2">Họ và tên</th>
                        <th rowspan="2">Cấp bậc</th>
                        <th rowspan="2">Chức vụ</th>
                        <th colspan="2" rowspan="1">Thời gian</th>
                    </tr>
                    <tr>
                        <td>Từ 7.30</td>
                        <td>Đến Từ 7.30</td>
                    </tr>
                    <!-- Lặp danh sách-->
                    <tr>
                        <td>01</td>
                        <td>Nguyễn quang B</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                     <tr>
                        <td>02</td>
                        <td>Nguyễn quang A</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                    <tr>
                        <td>03</td>
                        <td>Nguyễn quang D</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                    <tr>
                        <td>04</td>
                        <td>Nguyễn quang E</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                     <tr>
                        <td>05</td>
                        <td>Nguyễn quang F</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                      <tr>
                        <td>06</td>
                        <td>Nguyễn quang G</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                      <tr>
                        <td>07</td>
                        <td>Nguyễn quang H</td>
                        <td>/2/</td>
                        <td>TMT</td>
                        <td>18/5/2015</td>
                        <td>25/5/2015</td>
                    </tr>
                </table>
               </div>--%>


   
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
        <!-- Add Arrows -->
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
    </div>

    <!-- Swiper JS -->


    <!-- Initialize Swiper -->
    <script>
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable: true,
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: 3500,
            autoplayDisableOnInteraction: false
        });
    </script>

</asp:Content>
