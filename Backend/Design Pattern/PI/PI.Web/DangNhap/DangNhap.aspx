<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DangNhap.aspx.cs" Inherits="PI.Web.DangNhap.DangNhap" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Đăng nhập</title>
    <link href="../Content/bootstrap.min.css" rel="stylesheet" />
    <script src="../Scripts/jquery-1.10.2.min.js"></script>
    <script src="../Scripts/bootstrap.min.js"></script>
</head>
<body>

    <div id="loginModal" class="modal show" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
  <div class="modal-content">
      <div class="modal-header">          
          <h1 class="text-center">Đăng nhập</h1>
      </div>
      <div class="modal-body">
          <form id="form1" runat="server" class="form col-md-12 center-block">
            <div class="form-group">
              
                <asp:TextBox CssClass="form-control input-lg" runat="server" ID="txtUserName"></asp:TextBox>
            </div>
            <div class="form-group">
                <input class="form-control input-lg" type="password" runat="server" id="txtPass" />
            </div>
            <div class="form-group">
                <asp:Button CssClass="btn btn-primary btn-lg btn-block" runat="server" ID="btnLogin" OnClick="btnLogin_Click" Text="Đăng nhập" />           
            </div>
              <div class="form-group">
                  <asp:Label runat="server" ID="lblThongbao" Text=""></asp:Label>
              </div>
          </form>
      </div>
      <div class="modal-footer">          
      </div>
  </div>
  </div>
</div>

   <%-- <form id="form1" runat="server">
    <div>
    Tên đăng nhập: <asp:TextBox runat="server" ID="txtUserName"></asp:TextBox>
    Mật khẩu: <input type="password" runat="server" id="txtPass" />
    <asp:Button runat="server" ID="btnLogin" OnClick="btnLogin_Click" Text="Login" />
        <asp:Label runat="server" ID="lblThongbao" Text=""></asp:Label>
    </div>
    </form>--%>
</body>
</html>
