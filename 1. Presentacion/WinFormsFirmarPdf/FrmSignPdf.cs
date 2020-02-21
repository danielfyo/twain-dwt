using Funciones.Archivos.Pdf;
using Funciones.SocketServer;
using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Text;
using System.Windows.Forms;

namespace WinFormsFirmarPdf
{
    public partial class FrmSignPDf : Form
    {
        #region variables globales
        private EventLog _eventLog;
        private SocketServer _socketServer;
        private BackgroundWorker _bw;

        #endregion variables globales

        // constructor
        public FrmSignPDf()
        {
            InitializeComponent();
            InitializeEventLog();
            InitializeBackgroudWorker();
        }

        #region initializer
        private void InitializeBackgroudWorker()
        {
            _bw = new BackgroundWorker();
            _bw.DoWork += Bw_DoWork;
            _bw.WorkerSupportsCancellation = true;
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
        #endregion initializer

        #region private logic
        private void LogTransaction(string msg)
        {
            var logMsg = "<<<" + msg + " >>> | " + DateTime.Now + " | " + Environment.NewLine;
            WriteToFile(logMsg);
            _eventLog.WriteEntry(logMsg);
        }

        public bool SendBufferData(string response, Socket handler)
        {
            LogTransaction("Respondiendo petición...");
            //TODO: implementar logica de envio de respuesta
            _socketServer.Send(handler, response);
            LogTransaction("Respuesta enviada");
            return true;
        }

        public bool ReciveBufferData(string json, Socket handler)
        {
            try
            {
                LogTransaction("Procesando petición... ");
                WriteToFile(json);

                var jsonObject = JsonConvert
                .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>
                (json.Replace("<EOF>", ""));

                var pdfResponse = SendBufferData(SignPdf(json, jsonObject), handler);
                return pdfResponse;
                
                /*using (var swriter = new StreamWriter(@"C:\Windows\SysWOW64\IoIp\" + _jsonPathToProccess))
                    swriter.Write(stringBuilder.ToString());

                var jsonObject = JsonConvert
                    .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>
                    (json.Replace("<EOF>", ""));
                    */

            }
            catch (Exception exce)
            {
                LogTransaction(exce.StackTrace);
                LogTransaction(exce.Message);
                return false;
            }
        }

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

                    //LogTransaction("respuesta: " + response);
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
        #endregion private logic

        protected void OnStop()
        {
            LogTransaction("Deteniendo servicio ...");

            try
            {
                _socketServer.StopServer();
            }
            catch (Exception exce)
            {
                LogTransaction(exce.StackTrace);
                LogTransaction(exce.Message);
            }

            LogTransaction("Servicio detenido. " + DateTime.Now);
        }

        private void _bg_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            MessageBox.Show("Proceso finalizado");
            Application.Exit();
        }

        private void _bg_ProgressChanged(object sender, ProgressChangedEventArgs e)
            =>
            rtbTransactionLog
            .AppendText("Estado: " + e.UserState + " " +
                e.ProgressPercentage + "% "
                + Environment.NewLine);

        private void btnSign_Click(object sender, EventArgs e) => _bw.RunWorkerAsync();

        private void FrmSignPDf_Load(object sender, EventArgs e)
        {
            LogTransaction("Iniciando iniciado...");

            // iniciar el proceso asíncrono
            _bw.RunWorkerAsync();

            FileSystemWatcher watcher = new FileSystemWatcher();
            watcher.Path = @"C:\Windows\SysWOW64\IoIp\";
            watcher.NotifyFilter = NotifyFilters.LastWrite;
            watcher.Filter = "*.json";
            watcher.Changed += new FileSystemEventHandler(Watcher_Changed);
            watcher.EnableRaisingEvents = true;
        }

        private void Watcher_Changed(object sender, FileSystemEventArgs e)
        {
            MessageBox.Show("Procesando la firma de un nuevo documento pdf: " + e.Name + " " + e.ChangeType);
            //ProcessPath(e.Name);
        }
    }
}
