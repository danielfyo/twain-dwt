using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Funciones.Archivos
{
    public static class Archivos
    {
        private const string _rootPath = @"C:\ioip\";
        public const string _rootPathUpload = _rootPath + @"uploads\";
        public const string _documentsPath = _rootPathUpload + @"documents\";
        private const string _rootPathPdf = _documentsPath + @"pdf\";
        private const string _rootPathVideo = _documentsPath + @"video\";
        private const string _rootPathImage = _documentsPath + @"image\";

        public static async Task<byte[]> IFromFileToByteArray(IFormFile file)
        {
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                return ms.ToArray();
            }
        }

        public static async Task<byte[]> ByteArrayFromPath(string filePath)
        {

            byte[] bytes;

            using (var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                bytes = new byte[fs.Length];
                int numBytesToRead = (int)fs.Length;
                int numBytesRead = 0;
                while (numBytesToRead > 0)
                {
                    int n = fs.Read(bytes, numBytesRead, numBytesToRead);
                    if (n == 0)
                        break;

                    numBytesRead += n;
                    numBytesToRead -= n;
                }
            }
            return bytes;
        }

        public static async Task<byte[]> ProcessIFormFile(IFormFile file, bool crearArchivo, string name)
        {
            name = (name != null && name != string.Empty ) ? name : file.FileName;

            if (crearArchivo)
            {
                var newFilePath = await SaveFileFromIFromFile(file, null, name);
                return await ByteArrayFromPath(newFilePath);
            }
            else
                return await IFromFileToByteArray(file);
        }

        public static async Task<string> IFromFileToBase64Embedded(IFormFile file, bool crearArchivo, string fileName)
            => @"<embed width='100%' height='100%' name='plugin' src='data:application/pdf;base64," +
                await IFromFileToBase64(file, crearArchivo, fileName) +
                "' type='application/pdf'>";

        public static async Task<string> IFromFileToBase64(IFormFile file, bool crearArchivo, string fileName)
            => Convert.ToBase64String(await ProcessIFormFile(file, crearArchivo, fileName));

        public static async Task<string> SaveFileFromIFromFile(IFormFile file, dynamic metadatos, string name)
        {
            try
            {
                var contentType = file.ContentType
                    .Replace("video/", "")
                    .Replace("image/", "")
                    .Replace("application/", "")
                    .Replace("octet-stream","pdf");

                var filePath = "";

                switch (contentType)
                {
                    case "video":
                        filePath = _rootPathVideo;
                        break;
                    case "image":
                        filePath = _rootPathImage;
                        break;
                    case "pdf":
                        filePath = _rootPathPdf;
                        break;
                    default:
                        filePath = _rootPathUpload;
                        break;
                }

                if (!Directory.Exists(filePath))
                    Directory.CreateDirectory(filePath);

                if (File.Exists(filePath + name))
                    filePath += DateTime.Now.ToString("yyyyMMddhhmmss_") + name;
                else
                    filePath += name;

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                    await file.CopyToAsync(fileStream);

                return filePath;
            }
            catch (Exception exce)
            {
                return "";
            }
        }

    }
}
