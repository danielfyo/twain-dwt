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
                info.Add("Title", "Titulo IoIp");
                info.Add("Subject", "Asunto");
                info.Add("Keywords", "IoIp, Otros, Metadatos");
                info.Add("Creator", "IoIp");
                info.Add("Author", "IoIp");

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
