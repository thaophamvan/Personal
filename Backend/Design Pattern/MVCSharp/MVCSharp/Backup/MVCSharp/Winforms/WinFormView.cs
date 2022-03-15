//===========================================
// MVC# Framework | www.MVCSharp.org        |
// ------------------------------------------
// Copyright (C) 2008 www.MVCSharp.org      |
// All rights reserved.                     |
//===========================================

using System;
using System.Text;
using System.Windows.Forms;
using System.ComponentModel;
using MVCSharp.Core.Views;
using MVCSharp.Core;

namespace MVCSharp.Winforms
{
    #region Documentation
    /// <summary>
    /// Base implementation of the IView interface for windows forms
    /// presentation mechanism. Inherit your view classes from this one
    /// and override IView members if necessary.
    /// </summary>
    /// <remarks>
    /// This class also implements INotifiedView interface, which tells
    /// the views manager to notify the view on such events as view
    /// initialization and activation. Default implementation methods
    /// do nothing but descendant classes may override them to add some
    /// functionality.
    /// </remarks>
    /// <example>
    /// In this example we declare a view type by deriving it from the
    /// WinFormView class without a need to manually implement IView
    /// interface.
    /// <code>
    /// [WinformsView(typeof(MyTask), MyTask.MyView)]
    /// partial class MyView : WinFormView
    /// {
    ///     public MyView()
    ///     {
    ///         InitializeComponent();
    ///     }
    /// 
    ///     private buttonDoAction_Click(object sender, EventArgs e)
    ///     {
    ///         (Controller as MyController).DoAction();
    ///     }
    /// }
    /// </code>
    /// </example>
    /// <seealso cref="MVCSharp.Winforms.Configuration.WinformsViewAttribute"/>
    #endregion
    public class WinFormView : Form, IView, INotifiedView
    {
        private IController controller;
        private string viewName;

        #region Documentation
        /// <summary>
        /// Simple IView.Controller implementation with backing field.
        /// Marked as virtual, so can be overriden in subclasses.
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
        /// Simple IView.ViewName implementation with backing field.
        /// Marked as virtual, so can be overriden in subclasses.
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
        /// Marked as virtual, so can be overriden in subclasses.
        /// </summary>
        #endregion
        public virtual void Activate(bool activate)
        {
        }

        #region Documentation
        /// <summary>
        /// INotifiedView.Initialize empty implementation.
        /// Marked as virtual, so can be overriden in subclasses.
        /// </summary>
        #endregion
        public virtual void Initialize()
        {
        }
    }
}
