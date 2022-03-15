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
    /// Contains descriptions for all tasks. This collection is a part of
    /// an MVC# application configuration (see <see cref="MVCConfiguration.TaskInfos">MVCConfiguration.TaskInfos</see>).
    /// </summary>
    /// <remarks>When a task is started the neccessary <see cref="TaskInfo"/> object is obtained
    /// from the TaskInfoCollection object referenced by <see cref="MVCConfiguration"/>
    /// object (see <see cref="MVCConfiguration.TaskInfos">MVCConfiguration.TaskInfos</see>). If not found a new
    /// TaskInfo object is created with the help of
    /// <see cref="MVCConfiguration.TaskInfoProvider">MVCConfiguration.TaskInfoProvider</see> object.</remarks>
    /// <seealso cref="TaskInfo"/>
    #endregion
    public class TaskInfoCollection
    {
        private Hashtable taskInfos = new Hashtable();
        private MVCConfiguration mvcConfig;

        #region Documentation
        /// <summary>
        /// Indexer for obtaining the <see cref="TaskInfo"/> object given a task type. If the needed
        /// TaskInfo object does not exist yet the <see cref="MVCConfiguration.TaskInfoProvider">
        /// MVCConfiguration.TaskInfoProvider</see> object is used to create it.
        /// </summary>
        #endregion
        public TaskInfo this[Type taskType]
        {
            get
            {
                TaskInfo ti = taskInfos[taskType] as TaskInfo;
                if (ti == null)
                {
                    ti = mvcConfig.TaskInfoProvider.GetTaskInfo(taskType);
                    ti.ViewInfos = mvcConfig.ViewInfosByTask[taskType];
                    taskInfos[taskType] = ti;
                }
                return ti;
            }
            set { taskInfos[taskType] = value; }
        }

        #region Documentation
        /// <summary>
        /// Provides an association to the MVCConfiguration object.
        /// Neccessary for accessing the
        /// <see cref="MVCConfiguration.TaskInfoProvider"/> instance.</summary>
        #endregion
        public MVCConfiguration MVCConfig
        {
            get { return mvcConfig; }
            set { mvcConfig = value; }
        }
	
    }
}
