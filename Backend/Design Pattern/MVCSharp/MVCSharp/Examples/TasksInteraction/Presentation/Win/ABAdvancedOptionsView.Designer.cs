namespace MVCSharp.Examples.TasksInteraction.Presentation.Win
{
    partial class ABAdvancedOptionsView
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
            this.okBtn = new System.Windows.Forms.Button();
            this.workerOfTheMonthCB = new System.Windows.Forms.CheckBox();
            this.specialServicesCB = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // okBtn
            // 
            this.okBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.okBtn.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.okBtn.Location = new System.Drawing.Point(180, 85);
            this.okBtn.Name = "okBtn";
            this.okBtn.Size = new System.Drawing.Size(75, 23);
            this.okBtn.TabIndex = 0;
            this.okBtn.Text = "OK";
            this.okBtn.UseVisualStyleBackColor = true;
            this.okBtn.Click += new System.EventHandler(this.okBtn_Click);
            // 
            // workerOfTheMonthCB
            // 
            this.workerOfTheMonthCB.AutoSize = true;
            this.workerOfTheMonthCB.Location = new System.Drawing.Point(12, 12);
            this.workerOfTheMonthCB.Name = "workerOfTheMonthCB";
            this.workerOfTheMonthCB.Size = new System.Drawing.Size(167, 21);
            this.workerOfTheMonthCB.TabIndex = 1;
            this.workerOfTheMonthCB.Text = "Worker Of The Month";
            this.workerOfTheMonthCB.UseVisualStyleBackColor = true;
            // 
            // specialServicesCB
            // 
            this.specialServicesCB.AutoSize = true;
            this.specialServicesCB.Location = new System.Drawing.Point(12, 43);
            this.specialServicesCB.Name = "specialServicesCB";
            this.specialServicesCB.Size = new System.Drawing.Size(134, 21);
            this.specialServicesCB.TabIndex = 2;
            this.specialServicesCB.Text = "Special Services";
            this.specialServicesCB.UseVisualStyleBackColor = true;
            // 
            // ABAdvancedOptionsView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(267, 120);
            this.Controls.Add(this.specialServicesCB);
            this.Controls.Add(this.workerOfTheMonthCB);
            this.Controls.Add(this.okBtn);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "ABAdvancedOptionsView";
            this.Text = "Advanced Options";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button okBtn;
        private System.Windows.Forms.CheckBox workerOfTheMonthCB;
        private System.Windows.Forms.CheckBox specialServicesCB;
    }
}