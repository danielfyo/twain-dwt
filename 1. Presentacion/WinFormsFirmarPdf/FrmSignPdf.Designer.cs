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
            this.components = new System.ComponentModel.Container();
            this.btnSign = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.rtbTransactionLog = new System.Windows.Forms.RichTextBox();
            this._nofityIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this._contextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.toolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem2 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem3 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem4 = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripMenuItem5 = new System.Windows.Forms.ToolStripMenuItem();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this._contextMenu.SuspendLayout();
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
            // _nofityIcon
            // 
            this._nofityIcon.Text = "notifyIcon1";
            this._nofityIcon.Visible = true;
            // 
            // _contextMenu
            // 
            this._contextMenu.ImageScalingSize = new System.Drawing.Size(20, 20);
            this._contextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripMenuItem1,
            this.toolStripMenuItem2,
            this.toolStripMenuItem3,
            this.toolStripMenuItem4,
            this.toolStripMenuItem5});
            this._contextMenu.Name = "_contextMenu";
            this._contextMenu.Size = new System.Drawing.Size(190, 124);
            // 
            // toolStripMenuItem1
            // 
            this.toolStripMenuItem1.Name = "toolStripMenuItem1";
            this.toolStripMenuItem1.Size = new System.Drawing.Size(210, 24);
            this.toolStripMenuItem1.Text = "Ayuda";
            // 
            // toolStripMenuItem2
            // 
            this.toolStripMenuItem2.Name = "toolStripMenuItem2";
            this.toolStripMenuItem2.Size = new System.Drawing.Size(210, 24);
            this.toolStripMenuItem2.Text = "Visualizar";
            // 
            // toolStripMenuItem3
            // 
            this.toolStripMenuItem3.Name = "toolStripMenuItem3";
            this.toolStripMenuItem3.Size = new System.Drawing.Size(210, 24);
            this.toolStripMenuItem3.Text = "Consultar puerto";
            // 
            // toolStripMenuItem4
            // 
            this.toolStripMenuItem4.Name = "toolStripMenuItem4";
            this.toolStripMenuItem4.Size = new System.Drawing.Size(210, 24);
            this.toolStripMenuItem4.Text = "Reiniciar servicio";
            // 
            // toolStripMenuItem5
            // 
            this.toolStripMenuItem5.Name = "toolStripMenuItem5";
            this.toolStripMenuItem5.Size = new System.Drawing.Size(210, 24);
            this.toolStripMenuItem5.Text = "Cerrar";
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(61, 4);
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
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.FrmSignPDf_FormClosing);
            this.Load += new System.EventHandler(this.FrmSignPDf_Load);
            this.Resize += new System.EventHandler(this.FrmSignPDf_Resize);
            this._contextMenu.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnSign;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.RichTextBox rtbTransactionLog;
        private System.Windows.Forms.NotifyIcon _nofityIcon;
        private System.Windows.Forms.ContextMenuStrip _contextMenu;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem1;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem2;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem3;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem4;
        private System.Windows.Forms.ToolStripMenuItem toolStripMenuItem5;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
    }
}

