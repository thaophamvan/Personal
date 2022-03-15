//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System.Collections;
using System;

namespace MVCSharp.Core.Configuration.Views
{
    #region Documentation
    /// <summary>
    /// Represents a set of ViewInfoCollection objects for each
    /// task type. Thus includes descriptions for all views in the
    /// application.
    /// </summary>
    /// <remarks>This collection is a part of the <see cref="MVCConfiguration"/>
    /// object: when a task is started the necessary ViewInfoCollection object is
    /// obtained from the <see cref="MVCConfiguration.ViewInfosByTask"/> property.
    /// </remarks>
    #endregion
    public class ViewInfosByTaskCollection
    {
        #region Documentation
        /// <summary>
        /// Hashtable storing ViewInfoCollection objects with task types as keys.
        /// </summary>
        #endregion
        protected Hashtable viewInfosByTask = new Hashtable();

        #region Documentation
        /// <summary>
        /// Indexer to get or set ViewInfoCollection instance for a given task type.
        /// </summary>
        #endregion
        public ViewInfoCollection this[Type taskType]
        {
            get
            {
                return viewInfosByTask[taskType] as ViewInfoCollection;
            }
            set
            {
                viewInfosByTask[taskType] = value;
            }
        }
    }
}
