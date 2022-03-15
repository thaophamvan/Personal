//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using System.Collections;

namespace MVCSharp.Core.Configuration.Tasks
{
    #region Documentation
    /// <summary>
    /// Represents a collection of <see cref="InteractionPointInfo"/>
    /// objects accessible by the view name.
    /// </summary>
    /// <remarks>
    /// Such collection is a part of the <see cref="TaskInfo"/> object
    /// descibing a task (see <see cref="TaskInfo.InteractionPoints">
    /// TaskInfo.InteractionPoints</see>).</remarks>
    #endregion
    public class InteractionPointInfoCollection : IEnumerable
    {
        private Hashtable interactionPointInfos = new Hashtable();

        #region Documentation
        /// <summary>
        /// Gets the number of interation points within the collection.
        /// </summary>
        #endregion
        public int Count
        {
            get { return interactionPointInfos.Count; }
        }

        #region Documentation
        /// <summary>
        /// Accesses the description of an interaction point by the view name.
        /// </summary>
        #endregion
        public InteractionPointInfo this[string key]
        {
            get { return interactionPointInfos[key] as InteractionPointInfo; }
            set { interactionPointInfos[key] = value; }
        }

        #region Documentation
        /// <summary>
        /// Allows to enumerate through all interaction points within the collection.
        /// </summary>
        #endregion
        public IEnumerator GetEnumerator()
        {
            return interactionPointInfos.Values.GetEnumerator();
        }
    }
}
