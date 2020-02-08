using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Dto
{
    public class Ocr
    {
        public int IndexPage { get; set; }
        public string[] RecognizedText { get; set; }
        public string ByteArray { get; set; }
    }
}
