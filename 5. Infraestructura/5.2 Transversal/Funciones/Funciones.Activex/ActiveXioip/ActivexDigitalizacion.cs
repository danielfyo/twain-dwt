
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

                var pathIn = @"C:\Users\danie\OneDrive\Escritorio\prueba.pdf";
                var pathOutSigned = @"C:\Users\danie\OneDrive\Escritorio\prueba_signed_metadata.pdf";
                var pathAttach = @"C:\Users\danie\OneDrive\Escritorio\ok.pdf";

                var info = new Dictionary<string, string>();
                // propiedades extendidas
                info.Add("Producer", "Producer - IoIp Digitalización");
                info.Add("Keywords", "Keywords, Otros, Metadatos, IoIp");
                info.Add("Subject", "Subject - IoIp");
                info.Add("Creator", "Creator - IoIp");
                info.Add("Author", "Author - IoIp");
                info.Add("Title", "Title - IoIp");
                info.Add("CreateDate", "2008-10-24T16:47:28-04:00");

                //Dublin Core
                info.Add("Contributor", "http://www.ioip.com.co");
                info.Add("Coverage", "Artist");
                info.Add("Creator", "Artist");
                info.Add("Date", "1999-09-01");
                info.Add("Description", "W3Schools - Free tutorials");
                info.Add("Identifier", "Artist");
                info.Add("Language", "es");
                info.Add("Publisher", "Refsnes Data as");
                info.Add("Relation", "Artist");
                info.Add("Rights", "Artist");
                info.Add("Source", "Artist");
                info.Add("Relation", "Artist");
                info.Add("Type", "Web Development");


                // propiedades personalizadas
                info.Add("ModDate", "2006-10-24T16:47:28-04:00");
                info.Add("Custom", "IoIp");
                info.Add("Custom1", "IoIp Digitalización");
                info.Add("DocumentID", "uuid:1aa82404-7080-4651-bfef-1dd39b9b9ed8");
                info.Add("InstanceID", "uuid:cdda0ca6-7c91-4771-9dc9-796c8fe59350");
                info.Add("Format", "application/pdf");
                info.Add("Version", "1");
                info.Add("ModifyDate", "2006-10-24T16:47:28-04:00");
                info.Add("MetadataDate", "2006-10-24T16:47:28-04:00");
                info.Add("CreatorTool", "IoIp Digitalización");


                using (var pdfManager = new ManagePdfFile(pathIn, pathOutSigned))
                {
                    pdfManager.SignPdf(
                        SignRenderingMode.GRAPHIC_AND_DESCRIPTION,
                        @"C: \Users\danie\OneDrive\Escritorio\sign.png",
                        "54B2DB8FD73085245DB9B627FC4E40F7",
                        "FIRMA DIGITAL IOIP",
                        "http://www.ioip.com.co",
                        true,
                        false,
                        "http://www.ioip.com.co",
                        info,
                        new string[] { pathAttach },
                        100, 100, 300, 300,
                        "Firmado digitalmente por IoIp");
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
