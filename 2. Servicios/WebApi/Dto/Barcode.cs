using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Dto
{
    public class Barcode
    {
        public int IndexPage { get; set; }
        public int IndexInsidePage { get; set; }
        public string Type { get; set; }
        public string CodeData { get; set; }
        public string ByteArray { get; set; }
    }
}
