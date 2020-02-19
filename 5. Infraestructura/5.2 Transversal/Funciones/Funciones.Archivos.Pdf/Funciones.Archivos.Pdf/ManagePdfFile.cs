//using
#region using
using System.Collections.Generic;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;
using BcX509 = Org.BouncyCastle.X509;
using System.Security.Cryptography.X509Certificates;
using System;
using static iTextSharp.text.pdf.PdfSignatureAppearance;
using System.Linq;
using FirmarPdf.Dtos.PdfSign;
using PdfSignRequestDto.Dtos.PdfSign;
using Newtonsoft.Json;
//using System.Security.Cryptography;
#endregion using


namespace Funciones.Archivos.Pdf
{
    // sustitucion de enum de itextsharp para no pedir referencia a itext sharp en el cliente
    public enum SignRenderingMode
    {
        DESCRIPTION = 0,
        NAME_AND_DESCRIPTION = 1,
        GRAPHIC_AND_DESCRIPTION = 2,
        GRAPHIC = 3
    }

    // implemntacion de idisposable para controlar el cierre de los archivos en memoria
    public class ManagePdfFile : IDisposable
    {
        // variables globales
        #region variables globales
        // almacenamiento en memoria del pdf
        Stream _fs;
        //ruta de almacenamiento de salida del pdf procesado
        string _target;
        #endregion variables globales

        // constructor recibe como parametro el documento de entrada y salida (ruta o stringbase64)
        public ManagePdfFile()
        {
        }

        // permite obtener un byte array a partir de el almacenamiento en memoria
        public byte[] GetPdfByteArray() => (_fs as MemoryStream).ToArray();

        // genera un pdf en base64 a partir de un bytearray
        public string GetPdfByteArrayFromBase64() => Convert.ToBase64String(GetPdfByteArray());

        // almacena en memoria _fs
        private dynamic GetPdfStreamFormUrlOrBase64(string source)
        {
            if (!source.StartsWith("data:"))
                return new FileStream(source, FileMode.Open, FileAccess.ReadWrite, FileShare.None) as Stream;
            else
            {
                var parameters = source.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                return new MemoryStream(Convert.FromBase64String(parameters[1]));
            }
        }

        // busqueda de certificados desde el almacen de windows por seleccion manual y validacion por numero de serial
        private static X509Certificate2 SearchCertificate(string certificateSerialNumber)
        {
            /*string serial = null;
            CspParameters cspParameters = new CspParameters(1, "Microsoft Base Smart Card Crypto Provider");
            using (RSACryptoServiceProvider rsaProvider = new RSACryptoServiceProvider(cspParameters))
            {
                var x509Store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
                x509Store.Open(OpenFlags.ReadOnly);
                var pubKeyXml = rsaProvider.ToXmlString(false);
                var certificate = x509Store.Certificates.Cast<X509Certificate2>().FirstOrDefault(o => (o.PublicKey.Key.ToXmlString(false) == pubKeyXml) && o.HasPrivateKey);
                serial = certificate.SerialNumber;
            }*/
            
            var store = new X509Store();
            store.Open(OpenFlags.ReadOnly);
            var sel = X509Certificate2UI.SelectFromCollection(
                store.Certificates, "IoIp digital signer",
                "Por favor seleccione el certificado para firmar",
                X509SelectionFlag.SingleSelection);

            var cert = sel.Find(X509FindType.FindBySerialNumber, certificateSerialNumber, true);

            return (cert != null) ? cert[0] : null;
        }

        private dynamic GetImageFormUrlOrBase64(string source)
        {
            if (!source.StartsWith("data"))
                return Image.GetInstance(new FileStream(source, FileMode.Open, FileAccess.ReadWrite, FileShare.None));
            else
            {
                var parameters = source.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                return Image.GetInstance(new MemoryStream(Convert.FromBase64String(parameters[1])));
            }
        }
        // convertir stream en byte[]
        public static byte[] StreamToByteArray(Stream stream)
        {
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                var readBuffer = new byte[4096];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        var nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            var temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                var buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }

        // metodo principal para el procesamiento de pdfs (firma digital adjuntos metadatos)
        public string SignPdf(SignRenderingMode signRenderingMode, string path)
        {
            try
            {
                var json = File.ReadAllText(path);

                var jsonToProcess = JsonConvert
                    .DeserializeObject<Funciones.Archivos.Pdf.Dtos.PdfSign.PdfSignRequestDto>(json.Replace("<EOF>", ""));

                _target = jsonToProcess.outPath;
                _fs = GetPdfStreamFormUrlOrBase64(jsonToProcess.dataUriBase64PdfToSign);

                // conversor de certificados
                var objCP = new BcX509.X509CertificateParser();
                var crlList = new List<ICrlClient>();

                // buscar el certificado por numero serial
                var certificate = SearchCertificate(jsonToProcess.certificateSerialNumber);
                if (certificate == null)
                    return "No se encontraron certificados para el serial: " + jsonToProcess.certificateSerialNumber;

                // definicion del certificado operable
                var objChain = new BcX509.X509Certificate[] { objCP.ReadCertificate(certificate.RawData) };
                crlList.Add(new CrlClientOnline(objChain));

                //TODO: habilitar la estampa cronologica (Error) (verificar tsa Timestamping Authority)
                // agregamos la estampa cronologica 
                #region estampa cronologica
                ITSAClient tsaClient = null;
                IOcspClient ocspClient = null;
                if (jsonToProcess.addTimeStamp)
                {
                    ocspClient = new OcspClientBouncyCastle();
                    //CertificateUtil.getTSAURL(Org.BouncyCastle.Security.DotNetUtilities.FromX509Certificate(certificate));
                    tsaClient = new TSAClientBouncyCastle(jsonToProcess.urlTSA);
                }
                #endregion estampa cronologica

                // cargue del pdf al lector de itextsharp
                var _pdfReader = new PdfReader(_fs);

                // cargue an memoria del pdf
                using (var _wfs = new MemoryStream())
                {
                    // creacion de la firma a partir del lector itextsharp y el pdf en memoria
                    using (var objStamper = PdfStamper.CreateSignature(_pdfReader, _wfs, '\0', null, true))
                    {
                        // Procesar adjuntos
                        var attachmentIndex = 1;
                        (jsonToProcess.dataUriBase64ListOfPdfToAttach as List<FileToAttachDto>).ForEach(
                            (item) =>
                            {
                            //TODO: verificar si no se va a necesitar
                            if (!item.pathOrDataUriBase64.StartsWith("data:"))
                                {
                                    var pfs = PdfFileSpecification.FileEmbedded(objStamper.Writer, item.fileDescription, attachmentIndex + "_" + item.fileDescription + ".pdf", null, true);
                                    objStamper.Writer.AddFileAttachment("Adjunto número: " + attachmentIndex, pfs);
                                }
                                else
                                {
                                    try
                                    {
                                        var x = StreamToByteArray(GetPdfStreamFormUrlOrBase64(item.pathOrDataUriBase64));
                                        var pfs = PdfFileSpecification.FileEmbedded(
                                            objStamper.Writer,
                                            item.fileDescription + ".pdf",
                                            item.fileDescription + ".pdf",
                                            x,
                                            true,
                                            item.mimeType,
                                            null
                                            );
                                        objStamper.Writer.AddFileAttachment("Adjunto número: " + attachmentIndex, pfs);
                                    //.AddFileAttachment("adjunto número: " + attachmentIndex, x, "adjunto_" + attachmentIndex + ".pdf", "adjunto " + attachmentIndex);
                                }
                                    catch (Exception exce)
                                    {
                                        Console.WriteLine(exce.StackTrace);
                                    }
                                }
                                attachmentIndex++;
                            });

                        // definicion de la apariencia de la firma
                        var signatureAppearance = objStamper.SignatureAppearance;
                        // definicion del enum itextsharp a partir del enum parametro local
                        var mode = Enum.Parse(typeof(RenderingMode), signRenderingMode.ToString());
                        signatureAppearance.SignatureRenderingMode = (RenderingMode)mode;
                        signatureAppearance.Reason = jsonToProcess.reasonToSign;
                        signatureAppearance.Location = jsonToProcess.locationDescription;

                        // agregar marca visual de firma digital
                        #region agregar marca visual firma digital
                        if (jsonToProcess.addVisibleSignMark)
                        {
                            // definicion de imagen desde ruta o base64
                            signatureAppearance.SignatureGraphic = GetImageFormUrlOrBase64(jsonToProcess.dataUriBase64SignImage);
                            // definicion de la firma digital visible
                            signatureAppearance.SetVisibleSignature(
                                new Rectangle(jsonToProcess.visibleSignMarkWidth, jsonToProcess.visibleSignMarkHeight, jsonToProcess.xVisibleSignMarkPosition, jsonToProcess.yVisibleSignMarkPosition),
                                _pdfReader.NumberOfPages,
                                jsonToProcess.visibleSignText);

                        }
                        #endregion agregar marca visual firma digital

                        // Agregar propiedades extendidas
                        objStamper.MoreInfo = (jsonToProcess.metadata as List<MetadataDto>).ToDictionary(x => x.key, x => x.value);

                        //TODO: verificar si no es necesario la utilizacion de XMP manual (actualmente funciona)
                        #region xmp implementacion manual

                        /* objStamper.Writer.CreateXmpMetadata();
                        var xmp = objStamper.Writer.XmpMetadata;


                        //XMP metadatos
                        IXmpMeta xmp;
                        using (var stream = File.OpenRead(@"C:\Users\danie\OneDrive\Escritorio\xmpMetadata.xml"))
                            xmp = XmpMetaFactory.Parse(stream);

                        foreach (var property in xmp.Properties)
                        {
                            Console.WriteLine($"Path={property.Path} Namespace={property.Namespace} Value={property.Value}");
                        }

                        var serializeOptions = new SerializeOptions();
                        serializeOptions.UsePlainXmp = true;
                        var newMetadata = XmpMetaFactory.SerializeToBuffer(xmp, serializeOptions);
                        objStamper.XmpMetadata = newMetadata;*/
                        #endregion xmp implementacion manual

                        // Firmar digitalmente
                        var externalSignature = new X509Certificate2Signature(certificate, jsonToProcess.certificateHashAlgorithm);
                        MakeSignature.SignDetached(signatureAppearance, externalSignature, objChain, crlList, ocspClient, tsaClient, 0, CryptoStandard.CMS);
                    }
                    return Convert.ToBase64String(_wfs.ToArray());
                }
            }
            catch (Exception exce) 
            {
                WriteToFile(exce.StackTrace);
                WriteToFile(exce.Message);
                return exce.Message;
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

        // eliminacion de los objetos en memoria
        #region disposing
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
        #endregion disposing
    }
}
