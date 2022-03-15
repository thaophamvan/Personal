﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MVP
{
    public partial class Default : System.Web.UI.Page, IView
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }
        protected void ButtonResult_Click(object sender, EventArgs e)
        {
            CPresenter presenter = new CPresenter(this);
            presenter.CalculateCircleArea();
        }
        public string RadiusText
        {
            get { return TextRadius.Text; }
            set { TextRadius.Text = value; }
        }
        public string ResultText
        {
            get { return LabelResult.Text; }
            set { LabelResult.Text = value; }
        }
    }
}