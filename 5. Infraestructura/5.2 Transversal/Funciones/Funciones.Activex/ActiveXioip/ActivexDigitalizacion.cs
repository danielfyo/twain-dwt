
using System;
using System.Security.Cryptography.X509Certificates;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Threading;
using System.Text;
using Microsoft.Win32;
using System.Reflection;
using Funciones.Archivos.Pdf;
using System.Collections.Generic;

namespace ActiveXioip
{
    [ProgId("ActiveXDigitalizacion")]
    [Guid("121C3E0E-DC6E-45dc-952B-A6617F0FAA32")]
    [ClassInterface(ClassInterfaceType.AutoDual), ComSourceInterfaces(typeof(IControlEvents))]
    [ComVisible(true)]
    public class ActiveXDigitalizacion
    {
        [ComVisible(true)]
        public string parameters { get; set; }
        public string response { get; set; }
        public string certificateSerialNumber { get; set; }
        public event ControlEventHandler OnClose;
        public delegate void ControlEventHandler();
        public ManualResetEvent allDone;

        public ActiveXDigitalizacion()
        {
            //TODO: implementar lectura de parametros desde archvo de configuración
            OnClose += ActiveXDigitalizacion_OnClose;
            allDone = new ManualResetEvent(false);
        }

        private void ActiveXDigitalizacion_OnClose()
        {
            response = "prueba";
            MessageBox.Show("Operación finalizada.");
        }

        [ComVisible(true)]
        public void SignPdf()
        {
            try
            {
                MessageBox.Show(parameters);

                if (string.IsNullOrEmpty(certificateSerialNumber))
                {
                    response = "Error: el número de serie del certificado no puede ser nulo";
                    return;
                }

                var urlIn = @"C:\Users\danie\OneDrive\Escritorio\prueba.pdf";
                var urlOut = @"C:\Users\danie\OneDrive\Escritorio\prueba_signed.pdf";
                var pathAttach = @"C:\Users\danie\OneDrive\Escritorio\prueba_signed_metadata.pdf";

                var info = new Dictionary<string, string>();
                info.Add("Title", "Titulo IoIp");
                info.Add("Subject", "Asunto");
                info.Add("Keywords", "IoIp, Otros, Metadatos");
                info.Add("Creator", "IoIp");
                info.Add("Author", "IoIp");

                using (var pdfManager = new ManagePdfFile(urlIn, urlOut))
                {
                    pdfManager.SignPdf(
                        certificateSerialNumber,
                        "FIRMA DIGITAL IOIP",
                        "http://www.ioip.com.co",
                        true,
                        false,
                        "http://www.ioip.com.co",
                        info,
                        pathAttach
                        );
                }
            }
            catch (Exception e)
            {
                MessageBox.Show(e.StackTrace);
            }
        }

        [ComVisible(true)]
        public void Close()
        {
            if (OnClose != null)
                OnClose();
            else
                MessageBox.Show("No se adjunto el metodo de redirección");
        }

        [ComRegisterFunction()]
        public static void RegisterClass(string key)
        {
            var sb = new StringBuilder(key);

            sb.Replace(@"HKEY_CLASSES_ROOT\", "");
            var k = Registry.ClassesRoot.OpenSubKey(sb.ToString(), true);

            var ctrl = k.CreateSubKey("Control");
            ctrl.Close();

            var inprocServer32 = k.OpenSubKey("InprocServer32", true);
            inprocServer32.SetValue("CodeBase", Assembly.GetExecutingAssembly().CodeBase);
            inprocServer32.Close();
            k.Close();
            MessageBox.Show("ActiveX registrado con clave: " + key);
        }

        [ComUnregisterFunction()]
        public static void UnregisterClass(string key)
        {
            var sb = new StringBuilder(key);
            sb.Replace(@"HKEY_CLASSES_ROOT\", "");

            var subKey = Registry.ClassesRoot.OpenSubKey(sb.ToString(), true);

            subKey.DeleteSubKey("Control", false);

            subKey.OpenSubKey("InprocServer32", true);

            subKey.DeleteSubKey("CodeBase", false);

            subKey.Close();
            MessageBox.Show("ActiveX con clave de registro: " + key + ", eliminado");
        }

        [Guid("68BD4E0D-D7BC-4cf6-BEB7-CAB950161E79")]
        [InterfaceType(ComInterfaceType.InterfaceIsIDispatch)]
        public interface IControlEvents
        {
            [DispId(0x60020001)]
            string OnClose(string redirectUrl);
        }

    }
}
