namespace MVCSharp.Examples.TasksInteraction.Presentation.Win
{
    partial class EmployeesView
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
            this.employeesGridView = new System.Windows.Forms.DataGridView();
            this.awardBonusBtn = new System.Windows.Forms.Button();
            this.NameCol = new System.Windows.Forms.DataGridViewTextBoxColumn();
            ((System.ComponentModel.ISupportInitialize)(this.employeesGridView)).BeginInit();
            this.SuspendLayout();
            // 
            // employeesGridView
            // 
            this.employeesGridView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.employeesGridView.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.NameCol});
            this.employeesGridView.Dock = System.Windows.Forms.DockStyle.Top;
            this.employeesGridView.Location = new System.Drawing.Point(0, 0);
            this.employeesGridView.Name = "employeesGridView";
            this.employeesGridView.RowTemplate.Height = 24;
            this.employeesGridView.Size = new System.Drawing.Size(449, 205);
            this.employeesGridView.TabIndex = 0;
            // 
            // awardBonusBtn
            // 
            this.awardBonusBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.awardBonusBtn.Location = new System.Drawing.Point(333, 221);
            this.awardBonusBtn.Name = "awardBonusBtn";
            this.awardBonusBtn.Size = new System.Drawing.Size(104, 27);
            this.awardBonusBtn.TabIndex = 1;
            this.awardBonusBtn.Text = "Award Bonus";
            this.awardBonusBtn.UseVisualStyleBackColor = true;
            this.awardBonusBtn.Click += new System.EventHandler(this.awardBonusBtn_Click);
            // 
            // NameCol
            // 
            this.NameCol.DataPropertyName = "Name";
            this.NameCol.HeaderText = "Name";
            this.NameCol.Name = "NameCol";
            // 
            // EmployeesView
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(449, 260);
            this.Controls.Add(this.awardBonusBtn);
            this.Controls.Add(this.employeesGridView);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MinimizeBox = false;
            this.Name = "EmployeesView";
            this.Text = "Employees";
            ((System.ComponentModel.ISupportInitialize)(this.employeesGridView)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.DataGridView employeesGridView;
        private System.Windows.Forms.Button awardBonusBtn;
        private System.Windows.Forms.DataGridViewTextBoxColumn NameCol;
    }
}