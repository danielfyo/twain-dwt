using Funciones.Archivos.Pdf;
using Funciones.SocketServer;
using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net.Sockets;
using System.Windows.Forms;

namespace WinFormsFirmarPdf
{
    public partial class FrmSignPDf : Form
    {
        #region variables globales
        private EventLog _eventLog;
        private SocketServer _socketServer;
        private BackgroundWorker _bw;
        private bool _allowshowdisplay = true;

        #endregion variables globales

        // constructor
        public FrmSignPDf()
        {
            CheckForIllegalCrossThreadCalls = false;
            InitializeComponent();
            InitializeEventLog();
            InitializeBackgroudWorker();
            InitializeNotifyIcon();
            InitializeFileWatcher();
        }

        #region form events

        private void FrmSignPDf_Load(object sender, EventArgs e)
        {
            Icon = SystemIcons.Shield;
            WindowState = FormWindowState.Minimized;
            //SetVisibleCore(false);
            LogTransaction("Iniciando iniciado...");
            _bw.RunWorkerAsync();
        }

        //show the application again from clicking in notify icon
        private void _nofityIcon_Click(object sender, EventArgs e)
            => WindowState = FormWindowState.Normal; //SetVisibleCore(true);

        private void btnSign_Click(object sender, EventArgs e) 
            => _bw.RunWorkerAsync();

        //evaluate when the application is minimized tho show or hide icon in task bar or notify
        private void FrmSignPDf_Resize(object sender, EventArgs e)
            => ProcessResize(FormWindowState.Normal == WindowState || FormWindowState.Maximized == WindowState);

        //show or hide application
        protected override void SetVisibleCore(bool value)
            => base.SetVisibleCore(_allowshowdisplay ? value : _allowshowdisplay);

        //asset if the application continue working in second form or closes
        private void FrmSignPDf_FormClosing(object sender, FormClosingEventArgs e)
        {
            switch (MessageBox.Show("¿Desea continuar la aplicación en ejecución en segundo plano?",
                "Si: La ventana se cerrará pero la aplicación continuara en ejecución en segundo plano " + Environment.NewLine +
                "No: La aplicación terminará la ejecución " + Environment.NewLine +
                "Cancelar: Se aborta el cierre de la aplicación y continua su ejecución en pantalla",
                MessageBoxButtons.YesNoCancel))
            {
                case DialogResult.Yes:
                    MessageBox.Show("La aplicación continuará la aplicación en segundo plano");
                    e.Cancel = true;
                    this.WindowState = FormWindowState.Minimized;
                    break;
                case DialogResult.No:
                    MessageBox.Show("La aplicación se cerrará por completo y no podrá firmar digitalmente archivos pdf");
                    StopServer();
                    e.Cancel = false;
                    break;
                case DialogResult.Cancel:
                    MessageBox.Show("La aplicación continuará en ejecución en primer plano");
                    e.Cancel = true;
                    break;
                default: break;
            }

        }

        private void btnClearLog_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("", "", MessageBoxButtons.YesNo) == DialogResult.Yes)
                rtbTransactionLog.Clear();
        }
        #endregion form events

        #region initializer

        private void InitializeNotifyIcon()
        {
            _nofityIcon.Visible = false;
            _nofityIcon.BalloonTipIcon = ToolTipIcon.Info;
            _nofityIcon.BalloonTipText = "Presione para ver mas detellas";
            _nofityIcon.BalloonTipTitle = "Firmando documento digitalmente";
            _nofityIcon.Text = "Maximizar IoIP Digital sign for pdf";
            _nofityIcon.Click += _nofityIcon_Click;
            _nofityIcon.Icon = System.Drawing.SystemIcons.Shield;
            _nofityIcon.ShowBalloonTip(10000);
        }
        
        private void InitializeEventLog()
        {
            _eventLog = new EventLog();
            if (!EventLog.SourceExists("IoIp"))
            {
                EventLog.CreateEventSource("IoIp", "DigitalSignServiceLog");
            }
            _eventLog.Source = "IoIp";
            _eventLog.Log = "DigitalSignServiceLog";
        }
        
        private void InitializeBackgroudWorker()
        {
            _bw = new BackgroundWorker();
            _bw.DoWork += Bw_DoWork;
            _bw.ProgressChanged += Bw_ProgressChanged;
            _bw.RunWorkerCompleted += Bw_RunWorkerCompleted;
            _bw.WorkerSupportsCancellation = true;
        }

        private void InitializeFileWatcher()
        {
            FileSystemWatcher watcher = new FileSystemWatcher
            {
                Path = @"C:\Windows\SysWOW64\IoIp\",
                NotifyFilter = NotifyFilters.LastWrite,
                Filter = "*.json"
            };
            watcher.Changed += new FileSystemEventHandler(Watcher_Changed);
            watcher.EnableRaisingEvents = true;
        }

        #endregion initializer

        #region socket server

        //send buffer resonse to client of socket server
        public bool SendBufferData(string response, Socket handler)
        {
            try
            {
                LogTransaction("Respondiendo petición...");
                _socketServer.Send(handler, response);
                LogTransaction("Respuesta enviada");
                return true;
            }
            catch (Exception exce)
            {
                LogTransaction(exce.Message);
                LogTransaction(exce.StackTrace);
                return false;
            }
        }

        //recibe buffer from socket server
        public bool ReciveBufferData(string json, Socket handler)
        {
            try
            {
                LogTransaction("Procesando petición... ");
                
                //Unable to write in windows log
                WriteToFile(json);

                var jsonObject = JsonConvert
                    .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>
                    (json.Replace("<EOF>", ""));

                LogTransaction("Petición procesada... ");

                return SendBufferData(SignPdf(json, jsonObject), handler);
            }
            catch (Exception exce)
            {
                LogTransaction(exce.Message);
                LogTransaction(exce.StackTrace);
                return false;
            }
        }

        protected void StopServer()
        {
            LogTransaction("Deteniendo servicio ...");

            try
            {
                _socketServer.StopServer();
                if (_bw.IsBusy)
                    _bw.CancelAsync();
            }
            catch (Exception exce)
            {
                LogTransaction(exce.StackTrace);
                LogTransaction(exce.Message);
            }

            LogTransaction("Servicio detenido. " + DateTime.Now);
        }

        //backgorund process in backgroud
        private void Bw_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                //TODO: obtener puerto de configure.ini
                var port = 8000;
                LogTransaction("Iniciando socket server por el puerto: " + port);
                _socketServer = new SocketServer(ReciveBufferData);
                _socketServer.StartServer(port);
            }
            catch (Exception exce)
            {
                LogTransaction(exce.StackTrace);
                LogTransaction(exce.Message);
            }
        }

        //asynchronous process ends
        private void Bw_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            MessageBox.Show("Proceso finalizado");
            Application.Exit();
        }

        //asynchronous process report progress
        private void Bw_ProgressChanged(object sender, ProgressChangedEventArgs e)
            => rtbTransactionLog
                .AppendText("Estado: " + e.UserState + " " + 
                    e.ProgressPercentage + "% "
                    + Environment.NewLine);

        #endregion socket server

        #region private logic
        
        //Log
        private void LogTransaction(string msg)
        {
            var logMsg = "<<<" + msg + " >>> | " + DateTime.Now + " | " + Environment.NewLine;
            WriteToFile(logMsg);
            _eventLog.WriteEntry(logMsg);
            rtbTransactionLog.AppendText(Environment.NewLine + msg);
        }
        
        //write in log file
        public static void WriteToFile(string Message)
        {
            var path = AppDomain.CurrentDomain.BaseDirectory + "\\Logs";
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            var filepath = AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ServiceLog_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";

            if (!File.Exists(filepath))
                using (var sw = File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            else
                using (var sw = File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
        }

        //sign pdf
        public string SignPdf(string path, Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto jsonObject)
        {
            try
            {
                LogTransaction("Iniciando proceso de firmado");
                using (var pdfManager = new ManagePdfFile())
                {
                    var response = pdfManager.SignPdf(
                        SignRenderingMode.GRAPHIC_AND_DESCRIPTION,
                        jsonObject,
                        path
                        );
                    WriteToFile(response);
                    LogTransaction("Firma digital finalizada: ");
                    return response;
                }
            }
            catch (Exception exce)
            {
                LogTransaction(exce.Message);
                LogTransaction(exce.StackTrace);
                return exce.StackTrace;
            }
        }

        //process file triggered from file wathcer
        private string ProcessPath(string _jsonPathToProccess)
        {
            var path = @"C:\Windows\SysWOW64\IoIp\" + _jsonPathToProccess.Replace("-p", "").Trim();
            //WriteToFile(path);
            var jsonToProcess = File.ReadAllText(path);
            //WriteToFile("Procesando peticion:");
            //WriteToFile(jsonToProcess);
            var jsonObject = JsonConvert
                .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>
                (jsonToProcess.Replace("<EOF>", ""));

            return SignPdf(path, jsonObject);
        }

        private void Watcher_Changed(object sender, FileSystemEventArgs e)
        {
            MessageBox.Show("Procesando la firma de un nuevo documento pdf: " + e.Name + " " + e.ChangeType);
            //ProcessPath(e.Name);
        }

        private void ProcessResize(bool frmVisible)
        {
            _nofityIcon.Visible = !frmVisible;
            ShowInTaskbar = frmVisible;
            if (!frmVisible)
            {
                _nofityIcon.BalloonTipText = "La aplicación continua ejecutandose en segundo plano";
                _nofityIcon.BalloonTipText = "Minimizando aplicación";
                _nofityIcon.ShowBalloonTip(100000);
            }
        }

        #endregion private logic

    }
}
