namespace MVCSharp.Examples.SimpleFormsViewsManagerExample.TestGUI.Presentation
{
    partial class Form2
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
            this.toView1Btn = new System.Windows.Forms.Button();
            this.textBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // toView1Btn
            // 
            this.toView1Btn.Location = new System.Drawing.Point(68, 72);
            this.toView1Btn.Name = "toView1Btn";
            this.toView1Btn.Size = new System.Drawing.Size(75, 23);
            this.toView1Btn.TabIndex = 0;
            this.toView1Btn.Text = "To View1";
            this.toView1Btn.UseVisualStyleBackColor = true;
            this.toView1Btn.Click += new System.EventHandler(this.toView1Btn_Click);
            // 
            // textBox
            // 
            this.textBox.Location = new System.Drawing.Point(47, 27);
            this.textBox.Name = "textBox";
            this.textBox.Size = new System.Drawing.Size(116, 22);
            this.textBox.TabIndex = 1;
            // 
            // Form2
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(214, 130);
            this.Controls.Add(this.textBox);
            this.Controls.Add(this.toView1Btn);
            this.Name = "Form2";
            this.Text = "Form2";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button toView1Btn;
        private System.Windows.Forms.TextBox textBox;
    }
}