//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;

namespace MVCSharp.Core.Configuration.Tasks
{
    #region Documentation
    /// <summary>
    /// This is a composite <see cref="ITaskInfoProvider"/> implementation.
    /// It applies either <see cref="TaskInfoByXmlAttributeProvider"/> or
    /// <see cref="TaskInfoByAttributesProvider"/> depending on what attributes
    /// the task type is equipped with.
    /// </summary>
    #endregion
    public class DefaultTaskInfoProvider : ITaskInfoProvider
    {
        #region Documentation
        /// <summary>
        /// This <see cref="ITaskInfoProvider.GetTaskInfo"/> implementation applies
        /// either <see cref="TaskInfoByXmlAttributeProvider"/> or
        /// <see cref="TaskInfoByAttributesProvider"/> depending on what attributes
        /// the task type is equipped with.
        /// </summary>
        #endregion
        public TaskInfo GetTaskInfo(Type taskType)
        {
            if (taskType.GetCustomAttributes(typeof(TaskAttribute), false).Length > 0)
                return new TaskInfoByXmlAttributeProvider().GetTaskInfo(taskType);
            else
                return new TaskInfoByAttributesProvider().GetTaskInfo(taskType);
        }
    }
}
