using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
namespace PI.Common.User
{
    public class PiUser
    {
       
        #region singleton instance

        private static readonly PiUser SingletonInstance = new PiUser();

        static PiUser()
        {
        }

        private PiUser()
        {
        }
        public static PiUser Instance
        {
            get { return SingletonInstance;}
        }

        public string UserLoggedIn
        {
            get {
                if (HttpContext.Current.Request.Cookies["CurrentUser"] != null)
                {
                    return HttpContext.Current.Request.Cookies["CurrentUser"].Value;
                }
                return string.Empty;
                
            }
        }

        #endregion
    }
}
