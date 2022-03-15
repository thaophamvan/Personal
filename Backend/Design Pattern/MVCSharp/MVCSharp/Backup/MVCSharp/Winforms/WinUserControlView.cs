//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using System.ComponentModel;
using System.Windows.Forms;
using MVCSharp.Core.Views;
using MVCSharp.Core;

namespace MVCSharp.Winforms
{
    #region Documentation
    /// <summary>
    /// A base user control class implementing IView interface.
    /// User control classes may inherit from this class instead of
    /// implementing IView interface themselves. Neccessary IView
    /// members may be overriden.
    /// </summary>
    /// <remarks>This class also implements the <see cref="INotifiedView"/>
    /// interface (with empty methods) so in derived classes it is
    /// possible to override Activate and Initialize methods specifying
    /// response to (de)activation and initialization events.
    /// </remarks>
    #endregion
    public class WinUserControlView : UserControl, IView, INotifiedView
    {
        private IController controller;
        private string viewName;

        #region Documentation
        /// <summary>
        /// IView.Controller simple implementation with backing field.
        /// Marked as virtual so that can be overriden in subclasses.
        /// </summary>
        #endregion
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual IController Controller
        {
            get { return controller; }
            set { controller = value; }
        }

        #region Documentation
        /// <summary>
        /// IView.ViewName simple implementation with backing field.
        /// Marked as virtual so that can be overriden in subclasses.
        /// </summary>
        #endregion
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public virtual string ViewName
        {
            get { return viewName; }
            set { viewName = value; }
        }

        #region Documentation
        /// <summary>
        /// INotifiedView.Activate empty implementation.
        /// Marked as virtual so that can be overriden in subclasses.
        /// </summary>
        #endregion
        public virtual void Activate(bool activate)
        {
        }

        #region Documentation
        /// <summary>
        /// INotifiedView.Initialize empty implementation.
        /// Marked as virtual so that can be overriden in subclasses.
        /// </summary>
        #endregion
        public virtual void Initialize()
        {
        }
    }
}
