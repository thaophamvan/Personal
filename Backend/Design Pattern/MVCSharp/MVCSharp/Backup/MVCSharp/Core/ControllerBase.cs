//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using MVCSharp.Core.Tasks;
using MVCSharp.Core.Views;

namespace MVCSharp.Core
{
    #region Documentation
    /// <summary>
    /// Simple <see cref="IController"/> interface implementation
    /// with backing fields. Members are marked as virtual    
    /// so it is possible to override them in subclasses.
    /// </summary>
    /// <example>ControllerBase class prevents users from implementing
    /// <see cref="IController"/> manually, yet allowing to override IController members:
    /// <code>
    /// class MyController : ControllerBase
    /// {
    ///     public void MyOperation()
    ///     {
    ///         // Do something
    ///     }
    /// 
    ///     public override IView View
    ///     {
    ///         get { return base.View; }
    ///         set
    ///         {
    ///             base.View = value;
    ///             // Do view initialization
    ///         }
    ///     }
    /// }
    /// </code>
    /// </example>
    /// <seealso cref="IController"/>
    #endregion
    public class ControllerBase : IController
    {
        private ITask task;
        private IView view;

        #region Documentation
        /// <summary>
        /// Simple <see cref="IController.Task">IController.Task</see> implementation
        /// with backing field. Can be overriden in subclasses.
        /// </summary>
        #endregion
        public virtual ITask Task
        {
            get { return task; }
            set { task = value; }
        }

        #region Documentation
        /// <summary>
        /// Simple <see cref="IController.View">IController.View</see> implementation
        /// with backing field. Can be overriden in subclasses.
        /// </summary>
        #endregion
        public virtual IView View
        {
            get { return view; }
            set { view = value; }
        }
    }
}
