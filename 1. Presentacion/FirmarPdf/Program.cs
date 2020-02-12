using Funciones.SocketServer;

namespace FirmarPdf
{
    class Program
    {
        static void Main(string[] args)
        {
            new SocketServer().StartServer(1100);
        }
    }
}
