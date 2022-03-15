namespace MVCSharp.Examples.WindowsFormsExample.Presentation
{
    partial class MdiChildView
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

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.userControlView = new MVCSharp.Examples.WindowsFormsExample.Presentation.UserControlView();
            this.textBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // userControlView
            // 
            this.userControlView.BackColor = System.Drawing.SystemColors.ControlLight;
            this.userControlView.Location = new System.Drawing.Point(12, 66);
            this.userControlView.Name = "userControlView";
            this.userControlView.Size = new System.Drawing.Size(191, 111);
            this.userControlView.TabIndex = 1;
            // 
            // textBox
            // 
            this.textBox.Location = new System.Drawing.Point(12, 12);
            this.textBox.Name = "textBox";
            this.textBox.Size = new System.Drawing.Size(100, 22);
            this.textBox.TabIndex = 0;
            // 
            // MdiChildView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(292, 193);
            this.Controls.Add(this.textBox);
            this.Controls.Add(this.userControlView);
            this.Name = "MdiChildView";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private UserControlView userControlView;
        private System.Windows.Forms.TextBox textBox;
    }
}
