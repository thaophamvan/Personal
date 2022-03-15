namespace MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.Presentation
{
    partial class Form1
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
            this.toView2Btn = new System.Windows.Forms.Button();
            this.textBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // toView2Btn
            // 
            this.toView2Btn.Location = new System.Drawing.Point(61, 71);
            this.toView2Btn.Name = "toView2Btn";
            this.toView2Btn.Size = new System.Drawing.Size(75, 23);
            this.toView2Btn.TabIndex = 0;
            this.toView2Btn.Text = "To View2";
            this.toView2Btn.UseVisualStyleBackColor = true;
            this.toView2Btn.Click += new System.EventHandler(this.toView2Btn_Click);
            // 
            // textBox
            // 
            this.textBox.Location = new System.Drawing.Point(39, 23);
            this.textBox.Name = "textBox";
            this.textBox.Size = new System.Drawing.Size(118, 22);
            this.textBox.TabIndex = 1;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(204, 130);
            this.Controls.Add(this.textBox);
            this.Controls.Add(this.toView2Btn);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button toView2Btn;
        private System.Windows.Forms.TextBox textBox;
    }
}

