namespace MVCSharp.Examples.TasksInteraction.Presentation.Win
{
    partial class ABMainView
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
            this.contractsNumUpDown = new System.Windows.Forms.NumericUpDown();
            this.contractsLbl = new System.Windows.Forms.Label();
            this.customersLbl = new System.Windows.Forms.Label();
            this.customersNumUpDown = new System.Windows.Forms.NumericUpDown();
            this.advancedLinkLbl = new System.Windows.Forms.LinkLabel();
            this.okBtn = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.contractsNumUpDown)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.customersNumUpDown)).BeginInit();
            this.SuspendLayout();
            // 
            // contractsNumUpDown
            // 
            this.contractsNumUpDown.Location = new System.Drawing.Point(174, 12);
            this.contractsNumUpDown.Name = "contractsNumUpDown";
            this.contractsNumUpDown.Size = new System.Drawing.Size(45, 22);
            this.contractsNumUpDown.TabIndex = 0;
            // 
            // contractsLbl
            // 
            this.contractsLbl.AutoSize = true;
            this.contractsLbl.Location = new System.Drawing.Point(12, 14);
            this.contractsLbl.Name = "contractsLbl";
            this.contractsLbl.Size = new System.Drawing.Size(107, 17);
            this.contractsLbl.TabIndex = 1;
            this.contractsLbl.Text = "Contracts made";
            // 
            // customersLbl
            // 
            this.customersLbl.AutoSize = true;
            this.customersLbl.Location = new System.Drawing.Point(12, 49);
            this.customersLbl.Name = "customersLbl";
            this.customersLbl.Size = new System.Drawing.Size(135, 17);
            this.customersLbl.TabIndex = 3;
            this.customersLbl.Text = "Customers attracted";
            // 
            // customersNumUpDown
            // 
            this.customersNumUpDown.Location = new System.Drawing.Point(174, 47);
            this.customersNumUpDown.Name = "customersNumUpDown";
            this.customersNumUpDown.Size = new System.Drawing.Size(45, 22);
            this.customersNumUpDown.TabIndex = 2;
            // 
            // advancedLinkLbl
            // 
            this.advancedLinkLbl.AutoSize = true;
            this.advancedLinkLbl.Location = new System.Drawing.Point(12, 82);
            this.advancedLinkLbl.Name = "advancedLinkLbl";
            this.advancedLinkLbl.Size = new System.Drawing.Size(121, 17);
            this.advancedLinkLbl.TabIndex = 4;
            this.advancedLinkLbl.TabStop = true;
            this.advancedLinkLbl.Text = "Advanced options";
            this.advancedLinkLbl.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.advancedLinkLbl_LinkClicked);
            // 
            // okBtn
            // 
            this.okBtn.DialogResult = System.Windows.Forms.DialogResult.OK;
            this.okBtn.Location = new System.Drawing.Point(144, 118);
            this.okBtn.Name = "okBtn";
            this.okBtn.Size = new System.Drawing.Size(75, 23);
            this.okBtn.TabIndex = 5;
            this.okBtn.Text = "OK";
            this.okBtn.UseVisualStyleBackColor = true;
            this.okBtn.Click += new System.EventHandler(this.okBtn_Click);
            // 
            // ABMainView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(231, 153);
            this.Controls.Add(this.okBtn);
            this.Controls.Add(this.advancedLinkLbl);
            this.Controls.Add(this.customersLbl);
            this.Controls.Add(this.customersNumUpDown);
            this.Controls.Add(this.contractsLbl);
            this.Controls.Add(this.contractsNumUpDown);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "ABMainView";
            this.Text = "Award Bonus";
            ((System.ComponentModel.ISupportInitialize)(this.contractsNumUpDown)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.customersNumUpDown)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.NumericUpDown contractsNumUpDown;
        private System.Windows.Forms.Label contractsLbl;
        private System.Windows.Forms.Label customersLbl;
        private System.Windows.Forms.NumericUpDown customersNumUpDown;
        private System.Windows.Forms.LinkLabel advancedLinkLbl;
        private System.Windows.Forms.Button okBtn;
    }
}