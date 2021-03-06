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
    /// Attribute to describe a task structure with XML string.
    /// Should be used with <see cref="MVCConfiguration.TaskInfoProviderType"/>
    /// property pointing to <see cref="TaskInfoByXmlAttributeProvider"/> or
    /// <see cref="DefaultTaskInfoProvider"/> types.
    /// </summary>
    /// <example>
    /// This is how a task structure is described with XML string inside the
    /// [Task] attribute:
    /// <code>
    /// [Task(@&quot;
    ///     &lt;interactionPoints&gt;
    ///         &lt;interactionPoint view = &quot;&quot;View1&quot;&quot; controllerType = &quot;&quot;MyApp.MyController1&quot;&quot;&gt;
    ///             &lt;navTarget trigger = &quot;&quot;To View2&quot;&quot; view = &quot;&quot;View2&quot;&quot;/&gt;
    ///             &lt;navTarget view = &quot;&quot;View3&quot;&quot;/&gt;
    ///         &lt;/interactionPoint&gt;
    ///         &lt;iPoint view = &quot;&quot;View2&quot;&quot; controllerType = &quot;&quot;MyApp.MyController2&quot;&quot;&gt;
    ///         &lt;/iPoint&gt;
    ///         &lt;interactionPoint view = &quot;&quot;View3&quot;&quot; controllerType = &quot;&quot;MyApp.MyController3&quot;&quot;&gt;
    ///             &lt;navTarget trigger = &quot;&quot;To View2&quot;&quot; view = &quot;&quot;View2&quot;&quot;/&gt;
    ///         &lt;/interactionPoint&gt;
    ///     &lt;/interactionPoints&gt;
    /// &quot;)]
    /// class MyTask1 { }
    /// </code>
    /// Note that it is possible to use either interactionPoint tag or its short
    /// analog iPoint. Next example shows how to define adjacent interaction points
    /// with transitions possible between each two of them.
    /// <code>
    /// [Task(@&quot;
    ///     &lt;interactionPoints&gt;
    ///         &lt;interactionPoint view = &quot;&quot;View1&quot;&quot; controllerType = &quot;&quot;MyApp.MyController1&quot;&quot;&gt;
    ///             &lt;navTarget trigger = &quot;&quot;View2&quot;&quot; view = &quot;&quot;View3&quot;&quot;/&gt;
    ///         &lt;/interactionPoint&gt;
    ///         &lt;iPoint view = &quot;&quot;View2&quot;&quot; controllerType = &quot;&quot;MyApp.MyController2&quot;&quot;/&gt;
    ///         &lt;iPoint view = &quot;&quot;View3&quot;&quot; controllerType = &quot;&quot;MyApp.MyController3&quot;&quot;/&gt;
    ///         &lt;interactionPoint view = &quot;&quot;View4&quot;&quot; controllerType = &quot;&quot;MyApp.MyController3&quot;&quot;/&gt;
    ///     &lt;/interactionPoints&gt;
    ///     &lt;adjacentPoints&gt;
    ///         &lt;iPointRef view = &quot;&quot;View1&quot;&quot;/&gt;
    ///         &lt;interactionPointRef view = &quot;&quot;View2&quot;&quot;/&gt;
    ///         &lt;iPointRef view = &quot;&quot;View3&quot;&quot;/&gt;
    ///     &lt;/adjacentPoints&gt;
    ///     &lt;adjacentPoints&gt;
    ///         &lt;iPointRef view = &quot;&quot;View2&quot;&quot;/&gt;
    ///         &lt;interactionPointRef view = &quot;&quot;View3&quot;&quot;/&gt;
    ///     &lt;/adjacentPoints&gt;
    ///     &lt;adjacentPoints&gt;
    ///         &lt;iPointRef view = &quot;&quot;View3&quot;&quot;/&gt;
    ///         &lt;iPointRef view = &quot;&quot;View4&quot;&quot;/&gt;
    ///     &lt;/adjacentPoints&gt;
    /// &quot;)]
    /// class MyTask2 { }
    /// </code>
    /// </example>
    #endregion
    [AttributeUsage(AttributeTargets.Class)]
    public class TaskAttribute : Attribute
    {
        private string xml;

        #region Documentation
        /// <summary>
        /// Xml string describing the task.
        /// </summary>
        #endregion
        public string Xml
        {
            get { return xml; }
        }

        #region Documentation
        /// <summary>
        /// Constructor taking the task XML description as a parameter.
        /// </summary>
        #endregion
        public TaskAttribute(string xml)
        {
            this.xml = xml;
        }
    }
}
