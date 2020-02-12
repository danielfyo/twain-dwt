using ActiveXioip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FirmarPdf
{
    class Program
    {
        static void Main(string[] args)
        {
            ActiveXioip.ActiveXDigitalizacion.SignPdf();
        }
    }
}
