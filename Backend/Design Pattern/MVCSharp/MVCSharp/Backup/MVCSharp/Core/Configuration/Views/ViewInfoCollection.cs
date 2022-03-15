//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using System.Collections;

namespace MVCSharp.Core.Configuration.Views
{
    #region Documentation
    /// <summary>
    /// Represents a collection of <see cref="ViewInfo"/> objects with
    /// an indexer to retrieve an element by the view name.
    /// </summary>
    /// <remarks>
    /// Before a task is started the ViewInfoCollection object is stored
    /// within the <see cref="MVCSharp.Core.Configuration.Tasks.TaskInfo.ViewInfos">TaskInfo.ViewInfos</see> property.
    /// After a task is started the corresponding <see cref="MVCSharp.Core.Views.IViewsManager"/> is linked
    /// to this ViewInfoCollection object via its <see cref="MVCSharp.Core.Views.IViewsManager.ViewInfos">
    /// IViewsManager.ViewInfos</see> property.</remarks>
    /// <seealso cref="MVCSharp.Core.Views.IViewsManager.ViewInfos"/>
    /// <seealso cref="MVCConfiguration.ViewInfosByTask"/>
    #endregion
    public class ViewInfoCollection
    {
        private Hashtable viewInfoCollection = new Hashtable();

        #region Documentation
        /// <summary>
        /// Indexer to retrieve ViewInfo object by the view name.
        /// </summary>
        #endregion
        public ViewInfo this[string viewName]
        {
            get { return viewInfoCollection[viewName] as ViewInfo; }
            set { viewInfoCollection[viewName] = value; }
        }
    }
}
