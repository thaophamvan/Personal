using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Forms;
using MVCSharp.Core;
using MVCSharp.Core.Views;
using MVCSharp.Core.Configuration.Views;
using MVCSharp.Core.Configuration;

namespace MVCSharp.Examples.SimpleFormsViewsManagerExample
{
    public class SimpleFormsViewsManager : IViewsManager
    {
        private Navigator navigator;
        private ViewInfoCollection viewInfos;
        private Dictionary<string, Form> forms = new Dictionary<string, Form>();

        public void ActivateView(string viewName)
        {
            Form f = FindOrCreateView(viewName);
            f.Show();
            f.Activate();
        }

        public IView GetView(string viewName)
        {
            return (IView)FindOrCreateView(viewName);
        }

        private Form FindOrCreateView(string viewName)
        {
            Form result = null;
            forms.TryGetValue(viewName, out result);
            if ((result == null) || result.IsDisposed)
            {
                result = CreateHelper.Create(ViewInfos[viewName].ViewType) as Form;
                result.Activated += new EventHandler(view_Activated);
                forms[viewName] = result;
                (result as IView).ViewName = viewName;
                InitializeView(result as IView);
            }
            return result;
        }

        void view_Activated(object sender, EventArgs e)
        {
            Navigator.TryNavigateToView((sender as IView).ViewName);
        }

        private void InitializeView(IView view)
        {
            view.Controller = Navigator.GetController(view.ViewName);
            view.Controller.View = view;
        }

        public Navigator Navigator
        {
            get { return navigator; }
            set { navigator = value; }
        }

        public ViewInfoCollection ViewInfos
        {
            get { return viewInfos; }
            set { viewInfos = value; }
        }
    }
}
