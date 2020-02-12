using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;
using BcX509 = Org.BouncyCastle.X509;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using X509 = System.Security.Cryptography.X509Certificates;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Threading;
using System.Text;
using Microsoft.Win32;
using System.Reflection;

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
        public event ControlEventHandler OnClose;
        public delegate void ControlEventHandler(string redirectUrl);

        public ActiveXDigitalizacion()
        {
            //TODO: implementar lectura de parametros desde archvo de configuración
        }

        [ComVisible(true)]
        public void SignPdf()
        {
            try
            {
                MessageBox.Show(parameters);
                //var certificates = GetCertificates("Personal");
                //var certificate = GetCertificate("54b2db8fd73085245db9b627fc4e40f7", certificates);
                var store = new X509.X509Store();
                store.Open(X509.OpenFlags.ReadOnly);
                X509.X509Certificate2Collection sel = X509Certificate2UI.SelectFromCollection(store.Certificates, "IoIp digital signer", "Por favor seleccione el certificado para firmar", X509.X509SelectionFlag.SingleSelection);
                X509.X509Certificate2 cert = sel[0];
                SignHashed(
                    @"C:\Users\danie\OneDrive\Escritorio\prueba.pdf",
                    @"C:\Users\danie\OneDrive\Escritorio\prueba_signed.pdf",
                    cert,
                    "FIRMA DIGITAL IOIP",
                    "http://www.ioip.com.co",
                    true,
                    false,
                    "http://www.ioip.com.co"
                    );
                Thread.Sleep(2000);
                Close();

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
            {
                OnClose("http://otherwebsite.com"); 
            }
            else
            {
                MessageBox.Show("No se adjunto el metodo de redirección");
            }
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
            MessageBox.Show("ActiveX registrado con clave: " + key );
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

        private static void SignHashed(string Source, string Target, X509.X509Certificate2 Certificate, string Reason, string Location, bool AddVisibleSign, bool AddTimeStamp, string strTSA)
        {
            var objCP = new BcX509.X509CertificateParser();
            var objChain = new BcX509.X509Certificate[] { objCP.ReadCertificate(Certificate.RawData) };

            var crlList = new List<ICrlClient>();
            crlList.Add(new CrlClientOnline(objChain));

            var objReader = new PdfReader(Source);
            var objStamper = PdfStamper.CreateSignature(objReader, new FileStream(Target, FileMode.OpenOrCreate), '\0', null, true);

            var signatureAppearance = objStamper.SignatureAppearance;
            signatureAppearance.SignatureRenderingMode = PdfSignatureAppearance.RenderingMode.GRAPHIC_AND_DESCRIPTION;
            signatureAppearance.Reason = Reason;
            signatureAppearance.Location = Location;
            signatureAppearance.SignatureGraphic = Image.GetInstance(@"C:\Users\danie\OneDrive\Escritorio\sign.png");

            signatureAppearance.SetVisibleSignature(
                new Rectangle(100, 100, 300, 200),
                objReader.NumberOfPages,
                "Firma");

            if (AddVisibleSign)
                signatureAppearance.SetVisibleSignature(new Rectangle(100, 100, 300, 200), 1, null); //signatureAppearance.SetVisibleSignature(new Rectangle(100, 100, 250, 150), objReader.NumberOfPages, "Signature");

            ITSAClient tsaClient = null;
            IOcspClient ocspClient = null;

            if (AddTimeStamp)
            {
                ocspClient = new OcspClientBouncyCastle();
                tsaClient = new TSAClientBouncyCastle(strTSA);
            }
            var externalSignature = new X509Certificate2Signature(Certificate, "SHA-1");
            
            MakeSignature.SignDetached(signatureAppearance, externalSignature, objChain, crlList, ocspClient, tsaClient, 0, CryptoStandard.CMS);
            
            if (objReader != null)
                objReader.Close();
            if (objStamper != null)
                objStamper.Close();
        }

        public static List<X509.X509Certificate2> GetCertificates(string storeName)
        {
            var store = new X509.X509Store();
            var certificates = new List<X509.X509Certificate2>();
            store.Open(X509.OpenFlags.ReadOnly);
            certificates.AddRange(store.Certificates.Cast<X509.X509Certificate2>().ToList());
            store.Close();
            return certificates;
        }

        public static X509.X509Certificate2 GetCertificate(string serialNumber, List<X509.X509Certificate2> certificateList)
        {
            X509.X509Certificate2 response = null;
            response = certificateList.Where(x => x.SerialNumber.Equals(serialNumber, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
            return response;
        }
    }
}
