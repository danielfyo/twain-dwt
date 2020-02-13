using Funciones.Archivos.Pdf;
using System;
using System.Collections.Generic;

namespace FirmarPdf
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
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
                        "54B2DB8FD73085245DB9B627FC4E40F7",
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
                Console.WriteLine(e.StackTrace);
            }
            //new SocketServer().StartServer(1100);
        }
    }
}
