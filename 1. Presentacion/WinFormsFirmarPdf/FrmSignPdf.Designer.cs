namespace WinFormsFirmarPdf
{
    partial class FrmSignPDf
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
            this.btnSign = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.rtbTransactionLog = new System.Windows.Forms.RichTextBox();
            this.SuspendLayout();
            // 
            // btnSign
            // 
            this.btnSign.Location = new System.Drawing.Point(12, 8);
            this.btnSign.Name = "btnSign";
            this.btnSign.Size = new System.Drawing.Size(143, 60);
            this.btnSign.TabIndex = 0;
            this.btnSign.Text = "&Firmar";
            this.btnSign.UseVisualStyleBackColor = true;
            this.btnSign.Click += new System.EventHandler(this.btnSign_Click);
            // 
            // btnView
            // 
            this.btnView.Location = new System.Drawing.Point(161, 8);
            this.btnView.Name = "btnView";
            this.btnView.Size = new System.Drawing.Size(143, 60);
            this.btnView.TabIndex = 1;
            this.btnView.Text = "&Visualizar Pdf";
            this.btnView.UseVisualStyleBackColor = true;
            // 
            // rtbTransactionLog
            // 
            this.rtbTransactionLog.Location = new System.Drawing.Point(12, 77);
            this.rtbTransactionLog.Name = "rtbTransactionLog";
            this.rtbTransactionLog.Size = new System.Drawing.Size(749, 295);
            this.rtbTransactionLog.TabIndex = 2;
            this.rtbTransactionLog.Text = "";
            // 
            // FrmSignPDf
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.rtbTransactionLog);
            this.Controls.Add(this.btnView);
            this.Controls.Add(this.btnSign);
            this.Name = "FrmSignPDf";
            this.Text = "IoIp Firma Digital";
            this.Load += new System.EventHandler(this.FrmSignPDf_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnSign;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.RichTextBox rtbTransactionLog;
    }
}

