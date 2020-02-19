namespace FirmarPdf.Dtos.PdfSign
{
    public class FileToAttachDto
    {
        public int fileToAttachDtoId { get; set; }
        public string fileDescription { get; set; }
        public string pathOrDataUriBase64 { get; set; }
        public string mimeType { get; set; }

    }
}
