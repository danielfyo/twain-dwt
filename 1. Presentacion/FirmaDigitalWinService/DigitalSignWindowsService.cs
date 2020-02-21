using Funciones.Archivos.Pdf;
using Funciones.SocketServer;
using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Text;

namespace FirmaDigitalWinService
{
    public partial class DigitalSignWindowsService : ServiceBase
    {
        #region variables globales
        private EventLog _eventLog;
        private SocketServer _socketServer;
        private BackgroundWorker _bw;
        #endregion variables globales

        // constructor
        public DigitalSignWindowsService()
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

        public bool SendBufferData(string response)
        {
            LogTransaction("Respondiendo petición...");
            //TODO: implementar logica de envio de respuesta
            LogTransaction("Respuesta enviada");
            return true;
        }

        public bool ReciveBufferData(string json)
        {
            try
            {
                LogTransaction("Procesando petición... ");
                WriteToFile(json);

                var jsonObject = JsonConvert
                    .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>(json.Replace("<EOF>", ""));

                var id = Guid.NewGuid();
                var stringBuilder = new StringBuilder();
                stringBuilder.AppendLine(json);

                using (var swriter = new StreamWriter(@"C:\Windows\SysWOW64\IoIp\" + id + ".json"))
                    swriter.Write(stringBuilder.ToString());

                var pdfOut = SignPdf(jsonObject, id + ".json");
                return SendBufferData(pdfOut);
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
            catch(Exception exce)
            {
                LogTransaction(exce.StackTrace);
                LogTransaction(exce.Message);
            }
        }

        public string SignPdf(Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto jsonToProcess, string path)
        {
            try
            {
                LogTransaction("Iniciando proceso de firmado de archivo pdf");
                LogTransaction("\\\\localhost FirmarPdf.exe " + path);
                var pass = "dFyOl450Yt!\\";
                pass += "\"";
                var password = new System.Security.SecureString();
                password.AppendChar('D');
                
                var startInfo = new ProcessStartInfo
                {
                    CreateNoWindow = false,
                    UseShellExecute = false,
                    FileName = "psexec",//@"c:\windows\system32\FirmarPdf.exe",
                    WindowStyle = ProcessWindowStyle.Normal,
                    //UserName = ".\\danie",
                    //Domain = ".\\",
                    //Password = password,
                    Arguments = "\\\\localhost -i FirmarPdf " + path
                };


                LogTransaction("Ejecutando: " + startInfo.FileName + " " + startInfo.Arguments);

                try
                {
                    // Start the process with the info we specified.
                    // Call WaitForExit and then the using statement will close.
                    using (var exeProcess = Process.Start(startInfo))
                    {
                        exeProcess.();
                        LogTransaction("Proceso finalizado: " + startInfo.FileName + " " + startInfo.Arguments);
                    }
                }
                catch(Exception exce)
                {
                    LogTransaction(exce.StackTrace);
                    LogTransaction(exce.Message);
                }

                return "";
                /*pdfManager.SignPdf(
                    SignRenderingMode.GRAPHIC_AND_DESCRIPTION,
                    path
                    );*/
            }
            catch (Exception exce)
            {
                WriteToFile(exce.StackTrace);
                WriteToFile(exce.Message);
                return exce.StackTrace + " <-> " + exce.InnerException + "<-> " + exce.Message;
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

        #region override method
        protected override void OnStart(string[] args)
        {
            LogTransaction("Iniciando iniciado...");
            
            // Update the service state to Start Pending.
            ServiceStatus serviceStatus = new ServiceStatus
            {
                dwCurrentState = ServiceState.SERVICE_START_PENDING,
                dwWaitHint = 100000
            };
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);

            // iniciar el proceso asíncrono
            _bw.RunWorkerAsync();

            // Update the service state to Running.
            serviceStatus.dwCurrentState = ServiceState.SERVICE_RUNNING;
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);
        }

        protected override void OnStop()
        {
            LogTransaction("Deteniendo servicio ...");

            // Update the service state to Stop Pending.
            ServiceStatus serviceStatus = new ServiceStatus
            {
                dwCurrentState = ServiceState.SERVICE_STOP_PENDING,
                dwWaitHint = 100000
            };
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);

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

            // Update the service state to Stopped.
            serviceStatus.dwCurrentState = ServiceState.SERVICE_STOPPED;
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);
        }

        protected override void OnContinue()
            => LogTransaction("Servicio reanudado");
        #endregion override method

        #region interactive service
        [DllImport("advapi32.dll", SetLastError = true)]
        private static extern bool SetServiceStatus(System.IntPtr handle, ref ServiceStatus serviceStatus);

        public enum ServiceState
        {
            SERVICE_STOPPED = 0x00000001,
            SERVICE_START_PENDING = 0x00000002,
            SERVICE_STOP_PENDING = 0x00000003,
            SERVICE_RUNNING = 0x00000004,
            SERVICE_CONTINUE_PENDING = 0x00000005,
            SERVICE_PAUSE_PENDING = 0x00000006,
            SERVICE_PAUSED = 0x00000007,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct ServiceStatus
        {
            public int dwServiceType;
            public ServiceState dwCurrentState;
            public int dwControlsAccepted;
            public int dwWin32ExitCode;
            public int dwServiceSpecificExitCode;
            public int dwCheckPoint;
            public int dwWaitHint;
        };
        #endregion interactive service
    }
}
