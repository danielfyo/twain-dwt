using Funciones.Archivos.Pdf;
using Funciones.SocketServer;
using Newtonsoft.Json;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Text;
using System.Timers;

namespace FirmaDigitalWinService
{
    public partial class DigitalSignWindowsService : ServiceBase
    {
        #region variables globales
        private readonly Timer _timer;
        private readonly EventLog _eventLog;
        private SocketServer _socketServer;
        private BackgroundWorker _bw;
        #endregion variables globales
        public DigitalSignWindowsService()
        {
            _timer = new Timer();
            InitializeComponent();
            _bw = new BackgroundWorker();
            _bw.DoWork += _bw_DoWork;
            _bw.WorkerSupportsCancellation = true;
            _eventLog = new EventLog();
            if (!EventLog.SourceExists("IoIp"))
            {
                EventLog.CreateEventSource("IoIp", "DigitalSignServiceLog");
            }
            _eventLog.Source = "IoIp";
            _eventLog.Log = "DigitalSignServiceLog";
        }

        private void _bw_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                var port = 9000;
                //TODO: mover a backgroud worker async

                var ipHostInfo = Dns.GetHostEntry(Dns.GetHostName());
                var ipAddress = ipHostInfo.AddressList[1];
                WriteToFile("Iniciando por la ip: " + ipAddress + " puerto: " + port + " a las:" + DateTime.Now);

                _socketServer = new SocketServer(ReciveBufferData);
                _socketServer.StartServer(port);
            }catch(Exception exce)
            {
                WriteToFile(exce.StackTrace);
                WriteToFile(exce.Message);
            }
        }

        [DllImport("advapi32.dll", SetLastError = true)]
        private static extern bool SetServiceStatus(System.IntPtr handle, ref ServiceStatus serviceStatus);

        #region override method
        protected override void OnStart(string[] args)
        {
            // Update the service state to Start Pending.
            ServiceStatus serviceStatus = new ServiceStatus();
            serviceStatus.dwCurrentState = ServiceState.SERVICE_START_PENDING;
            serviceStatus.dwWaitHint = 100000;
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);

            var logMessage = "Iniciando iniciado a las: " + DateTime.Now;
            WriteToFile(logMessage);
            //_eventLog.WriteEntry(logMessage);
            //_timer.Elapsed += new ElapsedEventHandler(OnElapsedTime);
            //_timer.Interval = 10000; 
            //_timer.Enabled = true;

            _bw.RunWorkerAsync();

            // Update the service state to Running.
            serviceStatus.dwCurrentState = ServiceState.SERVICE_RUNNING;
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);            
        }

        protected override void OnStop()
        {
            // Update the service state to Stop Pending.
            ServiceStatus serviceStatus = new ServiceStatus();
            serviceStatus.dwCurrentState = ServiceState.SERVICE_STOP_PENDING;
            serviceStatus.dwWaitHint = 100000;
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);

            var logMessage = "Deteniendo a las: " + DateTime.Now;
            WriteToFile(logMessage);
            //_eventLog.WriteEntry(logMessage);
            //_timer.Stop();
            _socketServer.StopServer();
            WriteToFile("Servicio detenido a las:" +DateTime.Now);
            // Update the service state to Stopped.
            serviceStatus.dwCurrentState = ServiceState.SERVICE_STOPPED;
            SetServiceStatus(this.ServiceHandle, ref serviceStatus);
        }

        protected override void OnContinue()
        {
            var logMessage = "Servicio reanudado a las: " + DateTime.Now;
            WriteToFile(logMessage);
            _eventLog.WriteEntry(logMessage);
            _timer.Stop();
        }
        #endregion override method
        private void OnElapsedTime(object source, ElapsedEventArgs e)
        {
            var logMessage = "Servicio ejecutado a la: " + DateTime.Now;
            WriteToFile(logMessage);
            _eventLog.WriteEntry(logMessage);
        }

        public static bool ReciveBufferData(string json)
        {
            try
            {
                WriteToFile("Processando petición a las: " + DateTime.Now);
                WriteToFile(json);
                var jsonObject = JsonConvert
                    .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>(json.Replace("<EOF>", ""));

                var id = Guid.NewGuid();
                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.AppendLine(json);
                using (StreamWriter swriter = new StreamWriter(@"C:\Users\danie\OneDrive\Documentos\GitHub\ioip-twain-dwt\1. Presentacion\FirmarPdf\bin\Debug\" + id + ".json"))
                {
                    swriter.Write(stringBuilder.ToString());
                }
                var pdfOut = SignPdf(jsonObject, id + ".json");

                WriteToFile("Respondiendo petición a las: " + DateTime.Now);
                WriteToFile(pdfOut);
                return true;
            }
            catch (Exception exce)
            {
                WriteToFile(exce.StackTrace);
                WriteToFile(exce.Message);
                return false;
            }
        }

        public static bool SendBufferData(string response)
        {
            return true;
        }

        public static string SignPdf(Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto jsonToProcess, string path)
        {
            try
            {
                WriteToFile("Iniciando proceso de firmado de archivo pdf a las: "+DateTime.Now);
                
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.CreateNoWindow = false;
                startInfo.UseShellExecute = false;
                startInfo.FileName = "\"C:\\Users\\danie\\OneDrive\\Documentos\\GitHub\\ioip-twain-dwt\\1. Presentacion\\FirmarPdf\\bin\\Debug\\FirmarPdf.exe\"";
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
                startInfo.Arguments = path;

                WriteToFile("Ejecutando: " + startInfo.FileName + " " + startInfo.Arguments);

                try
                {
                    // Start the process with the info we specified.
                    // Call WaitForExit and then the using statement will close.
                    using (Process exeProcess = Process.Start(startInfo))
                    {
                        exeProcess.WaitForExit();
                        WriteToFile("Proceso finalizado: " + startInfo.FileName + " " + startInfo.Arguments);
                    }
                }
                catch
                {
                    // Log error.
                }

                return "";/*pdfManager.SignPdf(
                    SignRenderingMode.GRAPHIC_AND_DESCRIPTION,
                    path
                    );*/
            }
            catch (Exception exce)
            {
                WriteToFile(exce.StackTrace);
                WriteToFile(exce.Message);
                return exce.StackTrace + " <-> " + exce.InnerException + "<-> "+exce.Message;
            }
        }

        public static void WriteToFile(string Message)
        {
            var path = AppDomain.CurrentDomain.BaseDirectory + "\\Logs";
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            
            var filepath = AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ServiceLog_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
            
            if (!File.Exists(filepath))
                using (StreamWriter sw = File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            else
                using (StreamWriter sw = File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
        }

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
    }
}
