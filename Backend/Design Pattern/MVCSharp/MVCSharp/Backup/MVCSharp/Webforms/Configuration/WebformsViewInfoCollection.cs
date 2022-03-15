//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using MVCSharp.Core.Configuration.Views;
using System.Collections;

namespace MVCSharp.Webforms.Configuration
{
    #region Documentation
    /// <summary>
    /// Represents a collection of <see cref="WebformsViewInfo"/> objects
    /// with methods to access elements by the view name and view url
    /// strings.
    /// </summary>
    #endregion
    public class WebformsViewInfoCollection : ViewInfoCollection
    {
        private Hashtable viewInfosByUrls = new Hashtable();

        #region Documentation
        /// <summary>
        /// Adds WebformsViewInfo object to the collection.
        /// </summary>
        #endregion
        public void Add(WebformsViewInfo viewInf)
        {
            base[viewInf.ViewName] = viewInf;
            viewInf.ViewUrl = TrimAndLowerCase(viewInf.ViewUrl);
            viewInfosByUrls[viewInf.ViewUrl] = viewInf;
        }

        #region Documentation
        /// <summary>
        /// Accesses WebformsViewInfo object by the view name.
        /// </summary>
        #endregion
        new public WebformsViewInfo this[string viewName]
        {
            get { return base[viewName] as WebformsViewInfo; }
        }

        #region Documentation
        /// <summary>
        /// Accesses WebformsViewInfo object by the view url.
        /// </summary>
        #endregion
        public WebformsViewInfo GetByUrl(string viewUrl)
        {
            viewUrl = TrimAndLowerCase(viewUrl);
            return viewInfosByUrls[viewUrl] as WebformsViewInfo;
        }

        private string TrimAndLowerCase(string url)
        {
            url = url.ToLower();
            if (url.StartsWith("~/"))
                return url.Substring(2);
            else if (url.StartsWith("/"))
                return url.Substring(1);
            return url;
        }
    }
}
