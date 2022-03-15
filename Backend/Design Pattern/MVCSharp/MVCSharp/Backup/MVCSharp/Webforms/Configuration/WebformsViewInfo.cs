//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using MVCSharp.Core.Configuration.Views;

namespace MVCSharp.Webforms.Configuration
{
    #region Documentation
    /// <summary>
    /// Contains information about views within the Web Forms presentation
    /// mechanism. Along with the view name property includes view url, since
    /// view activation requires redirecting browser to the proper url.
    /// </summary>
    #endregion
    public class WebformsViewInfo : ViewInfo
    {
        private string viewName;

        private string viewUrl;

        #region Documentation
        /// <summary>
        /// Constructor taking the view name and url as parameters.
        /// </summary>
        #endregion
        public WebformsViewInfo(string viewName, string viewUrl) : base(null)
        {
            this.viewName = viewName;
            this.viewUrl = viewUrl;
        }

        #region Documentation
        /// <summary>
        /// Specifies the view url.
        /// </summary>
        #endregion
        public string ViewUrl
        {
            get { return viewUrl; }
            set { viewUrl = value; }
        }

        #region Documentation
        /// <summary>
        /// Specifies the view name.
        /// </summary>
        #endregion
        public string ViewName
        {
            get { return viewName; }
            set { viewName = value; }
        }
    }
}
