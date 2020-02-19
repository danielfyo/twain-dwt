using FirmarPdf.Dtos.PdfSign;
using PdfSignRequestDto.Dtos.PdfSign;
using System.Collections.Generic;

namespace Funciones.Archivos.Pdf.Dtos.PdfSign
{
	public class PdfSignRequestDto
	{
		public int PdfSignRequestDtoId { get; set; }
		public string dataUriBase64PdfToSign { get; set; }
		public string outPath { get; set; }
		public string SignRenderingMode { get; set; }
		public string dataUriBase64SignImage { get; set; }
		public string certificateSerialNumber { get; set; }
		public string reasonToSign { get; set; }
		public string locationDescription { get; set; }
		public bool addVisibleSignMark { get; set; }
		public int xVisibleSignMarkPosition { get; set; }
		public int yVisibleSignMarkPosition { get; set; }
		public int visibleSignMarkWidth { get; set; }
		public int visibleSignMarkHeight { get; set; }
		public string visibleSignText { get; set; }
		public bool addTimeStamp { get; set; }
		public string urlTSA { get; set; }
		public List<FileToAttachDto> dataUriBase64ListOfPdfToAttach { get; set; }
		public List<MetadataDto> metadata { get; set; }
		public string certificateHashAlgorithm { get; set; }
	}
}
