using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;
using BcX509 = Org.BouncyCastle.X509;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using X509 = System.Security.Cryptography.X509Certificates;

namespace ActiveXioip
{
    public class ActiveXioip
    {

        private static void SignHashed(string Source, string Target, X509.X509Certificate2 Certificate, string Reason, string Location, bool AddVisibleSign, bool AddTimeStamp, string strTSA)
        {
            var objCP = new BcX509.X509CertificateParser();
            var objChain = new BcX509.X509Certificate[] { objCP.ReadCertificate(Certificate.RawData) };

            IList<ICrlClient> crlList = new List<ICrlClient>();
            crlList.Add(new CrlClientOnline(objChain));

            PdfReader objReader = new PdfReader(Source);
            PdfStamper objStamper = PdfStamper.CreateSignature(objReader, new FileStream(Target, FileMode.OpenOrCreate), '\0');//, null, true);

            // Creamos la apariencia
            PdfSignatureAppearance signatureAppearance = objStamper.SignatureAppearance;

            // Si está la firma visible:
            if (AddVisibleSign)
                signatureAppearance.SetVisibleSignature(new Rectangle(100, 100, 300, 200), 1, null); //signatureAppearance.SetVisibleSignature(new Rectangle(100, 100, 250, 150), objReader.NumberOfPages, "Signature");

            ITSAClient tsaClient = null;
            IOcspClient ocspClient = null;

            // Si se ha añadido el sello de tiempo
            /*if (AddTimeStamp)
            {
                ocspClient = new OcspClientBouncyCastle();
                tsaClient = new TSAClientBouncyCastle(strTSA);
            }*/
            IExternalSignature externalSignature = externalSignature = new X509Certificate2Signature(Certificate, "SHA-1");
            
            // Creating the signature
            try
            {
                MakeSignature.SignDetached(signatureAppearance, externalSignature, objChain, crlList, ocspClient, tsaClient, 0, CryptoStandard.CMS);
            }
            catch (Exception exce)
            {
                Console.WriteLine(exce.StackTrace);
                return;
            }
            if (objReader != null)
                objReader.Close();
            if (objStamper != null)
                objStamper.Close();
        }
        public static async Task<byte[]> SignPdf()
        {
            byte[] response = null;
            var certificates = GetCertificates("Personal");
            var certificate = GetCertificate("54b2db8fd73085245db9b627fc4e40f7", certificates);
            var store = new X509.X509Store();
            store.Open(X509.OpenFlags.ReadOnly);
            X509.X509Certificate2Collection sel = X509Certificate2UI.SelectFromCollection(store.Certificates, "IoIp", "Por favor seleccione el certificado para firmar", X509.X509SelectionFlag.SingleSelection);
            X509.X509Certificate2 cert = sel[0];
            SignHashed(
                @"C:\Users\danie\OneDrive\Escritorio\prueba.pdf",
                @"C:\Users\danie\OneDrive\Escritorio\prueba_signed.pdf",
                cert,
                "Razon",
                "CO",
                true,
                true,
                "http://www.ioip.com.co"
                );
            return response;
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
