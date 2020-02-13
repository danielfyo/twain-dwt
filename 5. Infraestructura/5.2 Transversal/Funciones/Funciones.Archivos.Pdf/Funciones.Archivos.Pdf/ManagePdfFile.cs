using System.Collections.Generic;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;
using BcX509 = Org.BouncyCastle.X509;
using System.Security.Cryptography.X509Certificates;
using System;
using XmpCore;
using XmpCore.Options;
using XmpCore.Impl;

namespace Funciones.Archivos.Pdf
{
    public class ManagePdfFile : IDisposable
    {
        Stream _fs;
        string _target;

        public ManagePdfFile(string source, string target)
        {
            _target = target;
            _fs = GetStreamFormUrlOrBase64(source);
        }

        public byte[] GetPDfByteArray() => (_fs as MemoryStream).ToArray();

        public string GetPDfBase64() => Convert.ToBase64String(GetPDfByteArray());

        private dynamic GetStreamFormUrlOrBase64(string source)
            => !source.StartsWith("data") ?
            new FileStream(source, FileMode.Open, FileAccess.ReadWrite, FileShare.None) as Stream :
            new MemoryStream(Convert.FromBase64String(source));

        public void AddMetadata(Dictionary<string, string> dictionary)
        {
            var _pdfReader = new PdfReader(_fs);
            using (var _pdfStamper = new PdfStamper(_pdfReader, new FileStream(_target, FileMode.OpenOrCreate)))
            {
                _pdfStamper.MoreInfo = dictionary;
            }
            _pdfReader.Close();
        }
        public void AddAtachment(string description, string base64FileToAtach)
        {
            var _pdfReader = new PdfReader(_fs);
            using (var _pdfStamper = new PdfStamper(_pdfReader, new FileStream(_target, FileMode.OpenOrCreate)))
            using (var _wfs = new FileStream(_target, FileMode.OpenOrCreate))
            using (var pdfWriter = PdfWriter.GetInstance(new Document(), new MemoryStream(Convert.FromBase64String(base64FileToAtach))))
            {
                var pdfSpacification = PdfFileSpecification.FileEmbedded(pdfWriter, @"c:\pdf.pdf", "pdf.pdf", null);
                _pdfStamper.AddFileAttachment(description, pdfSpacification);
            }
        }

        public string SignPdf(
            string serialNumberCertificate,
            string Reason,
            string Location,
            bool AddVisibleSign,
            bool AddTimeStamp,
            string strTSA,
            Dictionary<string, string> metadata,
            string fileToAttach
            )
        {
            var objCP = new BcX509.X509CertificateParser();
            var crlList = new List<ICrlClient>();

            // buscar el certificado
            var certificate = SearchCertificate(serialNumberCertificate);
            if (certificate == null)
                return "No se encontraron certificados para el serial: " + serialNumberCertificate;
            var objChain = new BcX509.X509Certificate[] { objCP.ReadCertificate(certificate.RawData) };

            //TODO: habilitar la estampa cronologica
            // agregamos la estampa cronologica
            ITSAClient tsaClient = null;
            IOcspClient ocspClient = null;

            if (AddTimeStamp)
            {
                ocspClient = new OcspClientBouncyCastle();
                CertificateUtil.getTSAURL(Org.BouncyCastle.Security.DotNetUtilities.FromX509Certificate(certificate));
                tsaClient = new TSAClientBouncyCastle(strTSA);
            }

            crlList.Add(new CrlClientOnline(objChain));
            var _pdfReader = new PdfReader(_fs);
            using (var _wfs = new FileStream(_target, FileMode.OpenOrCreate))
            using (var objStamper = PdfStamper.CreateSignature(_pdfReader, _wfs, '\0', null, true))
            {
                var signatureAppearance = objStamper.SignatureAppearance;
                signatureAppearance.SignatureRenderingMode = PdfSignatureAppearance.RenderingMode.GRAPHIC_AND_DESCRIPTION;
                signatureAppearance.Reason = Reason;
                signatureAppearance.Location = Location;
                signatureAppearance.SignatureGraphic = Image.GetInstance(@"C:\Users\danie\OneDrive\Escritorio\sign.png");

                signatureAppearance.SetVisibleSignature(
                    new Rectangle(100, 100, 300, 200),
                    _pdfReader.NumberOfPages,
                    "Firma");

                if (AddVisibleSign)
                    signatureAppearance.SetVisibleSignature(new Rectangle(100, 100, 300, 200), 1, null); //signatureAppearance.SetVisibleSignature(new Rectangle(100, 100, 250, 150), objReader.NumberOfPages, "Signature");

                // Agregar propiedades extendidas
                objStamper.MoreInfo = metadata;

                //XMP metadatos
                //IXmpMeta xmp;
                //using (var stream = File.OpenRead(@"C:\Users\danie\OneDrive\Escritorio\xmpMetadata.xml"))
                    //xmp = XmpMetaFactory.Parse(stream);

                //foreach (var property in xmp.Properties)
                //{
                    //Console.WriteLine($"Path={property.Path} Namespace={property.Namespace} Value={property.Value}");
                //}

                //var serializeOptions = new SerializeOptions();
                //serializeOptions.UsePlainXmp = true;
                //var newMetadata = XmpMetaFactory.SerializeToBuffer(xmp, serializeOptions);
                //objStamper.XmpMetadata = newMetadata;


                // Procesar adjuntos
                var pfs = PdfFileSpecification.FileEmbedded(objStamper.Writer, fileToAttach, "ok.pdf", null);
                objStamper.Writer.AddFileAttachment(pfs);

                // Firmar digitalmente
                var externalSignature = new X509Certificate2Signature(certificate, "SHA-1");
                MakeSignature.SignDetached(signatureAppearance, externalSignature, objChain, crlList, ocspClient, tsaClient, 0, CryptoStandard.CMS);
            }
            return "";
        }

        private static X509Certificate2 SearchCertificate(string certificateSerialNumber)
        {
            var store = new X509Store();
            store.Open(OpenFlags.ReadOnly);
            var sel = X509Certificate2UI.SelectFromCollection(
                store.Certificates, "IoIp digital signer",
                "Por favor seleccione el certificado para firmar",
                X509SelectionFlag.SingleSelection);

            var cert = sel.Find(X509FindType.FindBySerialNumber, certificateSerialNumber, true);

            return (cert != null) ? cert[0] : null;
        }

        public void Dispose()
        {
            if (_fs != null)
            {
                _fs.Close();
                _fs.Dispose();
            }
        }

        ~ManagePdfFile()
        {
            Dispose();
        }

        /*public static void AtachFiles(string Source, string Target, X509Certificate2 Certificate, string Reason, string Location, bool AddVisibleSign, bool AddTimeStamp, string strTSA)
        {
            Document PDFD = new iTextSharp. Document(PageSize.LETTER);
            pdf.PdfWriter writer;
            writer = pdf.PdfWriter.GetInstance(PDFD, new FileStream(targetpath, FileMode.Create));
            pdf.PdfFileSpecification pfs = pdf.PdfFileSpecification.FileEmbedded(writer, "C:\\test.xml", "New.xml", null);
            writer.AddFileAttachment(pfs);
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

        public static X509Certificate2 GetCertificate(string serialNumber, List<X509.X509Certificate2> certificateList)
        {
            X509Certificate2 response = null;
            response = certificateList.Where(x => x.SerialNumber.Equals(serialNumber, StringComparison.CurrentCultureIgnoreCase)).FirstOrDefault();
            return response;
        }*/
    }
}
