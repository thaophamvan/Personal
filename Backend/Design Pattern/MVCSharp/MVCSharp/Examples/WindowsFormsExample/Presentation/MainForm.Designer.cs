namespace MVCSharp.Examples.WindowsFormsExample.Presentation
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.menuStrip = new System.Windows.Forms.MenuStrip();
            this.viewsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.mdiChild1ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.mdiChild2ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.userControlView1ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.userControlView2ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.aboutDlgViewToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.currentViewStatusLbl = new System.Windows.Forms.ToolStripStatusLabel();
            this.menuStrip.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip
            // 
            this.menuStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.viewsToolStripMenuItem});
            this.menuStrip.Location = new System.Drawing.Point(0, 0);
            this.menuStrip.Name = "menuStrip";
            this.menuStrip.Size = new System.Drawing.Size(523, 26);
            this.menuStrip.TabIndex = 0;
            this.menuStrip.Text = "menuStrip1";
            // 
            // viewsToolStripMenuItem
            // 
            this.viewsToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mdiChild1ToolStripMenuItem,
            this.mdiChild2ToolStripMenuItem,
            this.userControlView1ToolStripMenuItem,
            this.userControlView2ToolStripMenuItem,
            this.aboutDlgViewToolStripMenuItem});
            this.viewsToolStripMenuItem.Name = "viewsToolStripMenuItem";
            this.viewsToolStripMenuItem.Size = new System.Drawing.Size(56, 22);
            this.viewsToolStripMenuItem.Text = "Views";
            // 
            // mdiChild1ToolStripMenuItem
            // 
            this.mdiChild1ToolStripMenuItem.Name = "mdiChild1ToolStripMenuItem";
            this.mdiChild1ToolStripMenuItem.Size = new System.Drawing.Size(203, 22);
            this.mdiChild1ToolStripMenuItem.Text = "Mdi Child1";
            this.mdiChild1ToolStripMenuItem.Click += new System.EventHandler(this.ToolStripMenuItem_Click);
            // 
            // mdiChild2ToolStripMenuItem
            // 
            this.mdiChild2ToolStripMenuItem.Name = "mdiChild2ToolStripMenuItem";
            this.mdiChild2ToolStripMenuItem.Size = new System.Drawing.Size(203, 22);
            this.mdiChild2ToolStripMenuItem.Text = "Mdi Child2";
            this.mdiChild2ToolStripMenuItem.Click += new System.EventHandler(this.ToolStripMenuItem_Click);
            // 
            // userControlView1ToolStripMenuItem
            // 
            this.userControlView1ToolStripMenuItem.Name = "userControlView1ToolStripMenuItem";
            this.userControlView1ToolStripMenuItem.Size = new System.Drawing.Size(203, 22);
            this.userControlView1ToolStripMenuItem.Text = "UserControlView1";
            this.userControlView1ToolStripMenuItem.Click += new System.EventHandler(this.ToolStripMenuItem_Click);
            // 
            // userControlView2ToolStripMenuItem
            // 
            this.userControlView2ToolStripMenuItem.Name = "userControlView2ToolStripMenuItem";
            this.userControlView2ToolStripMenuItem.Size = new System.Drawing.Size(203, 22);
            this.userControlView2ToolStripMenuItem.Text = "UserControlView2";
            this.userControlView2ToolStripMenuItem.Click += new System.EventHandler(this.ToolStripMenuItem_Click);
            // 
            // aboutDlgViewToolStripMenuItem
            // 
            this.aboutDlgViewToolStripMenuItem.Name = "aboutDlgViewToolStripMenuItem";
            this.aboutDlgViewToolStripMenuItem.Size = new System.Drawing.Size(203, 22);
            this.aboutDlgViewToolStripMenuItem.Text = "About Dlg View";
            this.aboutDlgViewToolStripMenuItem.Click += new System.EventHandler(this.ToolStripMenuItem_Click);
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.currentViewStatusLbl});
            this.statusStrip.Location = new System.Drawing.Point(0, 343);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(523, 23);
            this.statusStrip.TabIndex = 1;
            this.statusStrip.Text = "statusStrip1";
            // 
            // currentViewStatusLbl
            // 
            this.currentViewStatusLbl.Name = "currentViewStatusLbl";
            this.currentViewStatusLbl.Size = new System.Drawing.Size(74, 18);
            this.currentViewStatusLbl.Text = "[currView]";
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(523, 366);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.menuStrip);
            this.MainMenuStrip = this.menuStrip;
            this.Name = "MainForm";
            this.Text = "Main Form";
            this.menuStrip.ResumeLayout(false);
            this.menuStrip.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.MenuStrip menuStrip;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel currentViewStatusLbl;
        private System.Windows.Forms.ToolStripMenuItem viewsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem mdiChild1ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem mdiChild2ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem userControlView1ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem userControlView2ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem aboutDlgViewToolStripMenuItem;
    }
}

