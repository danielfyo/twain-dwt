using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Dto.Out
{
    public class DigitalizacionOutDto
    {
        public int Paginas { get; set; }
        public string ByteArray { get; set; }
        public string MimeType { get; set; }
        public Ocr[] Ocr { get; set; }
        public Barcode[] Barcodes { get; set; }
    }
}
