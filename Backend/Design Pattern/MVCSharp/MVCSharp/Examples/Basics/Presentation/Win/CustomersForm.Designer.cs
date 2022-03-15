namespace MVCSharp.Examples.Basics.Presentation.Win
{
    public partial class CustomersForm
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
            this.customersGridView = new System.Windows.Forms.DataGridView();
            this.showOrdersButton = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.customersGridView)).BeginInit();
            this.SuspendLayout();
            // 
            // customersGridView
            // 
            this.customersGridView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.customersGridView.Dock = System.Windows.Forms.DockStyle.Top;
            this.customersGridView.Location = new System.Drawing.Point(0, 0);
            this.customersGridView.Name = "customersGridView";
            this.customersGridView.RowTemplate.Height = 24;
            this.customersGridView.Size = new System.Drawing.Size(307, 157);
            this.customersGridView.TabIndex = 0;
            this.customersGridView.CurrentCellChanged += new System.EventHandler(this.customersGridView_CurrentCellChanged);
            // 
            // showOrdersButton
            // 
            this.showOrdersButton.Location = new System.Drawing.Point(194, 163);
            this.showOrdersButton.Name = "showOrdersButton";
            this.showOrdersButton.Size = new System.Drawing.Size(105, 30);
            this.showOrdersButton.TabIndex = 1;
            this.showOrdersButton.Text = "Show Orders";
            this.showOrdersButton.UseVisualStyleBackColor = true;
            this.showOrdersButton.Click += new System.EventHandler(this.showOrdersButton_Click);
            // 
            // CustomersForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(307, 201);
            this.Controls.Add(this.showOrdersButton);
            this.Controls.Add(this.customersGridView);
            this.Name = "CustomersForm";
            this.Text = "Customers";
            ((System.ComponentModel.ISupportInitialize)(this.customersGridView)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.DataGridView customersGridView;
        private System.Windows.Forms.Button showOrdersButton;
    }
}

