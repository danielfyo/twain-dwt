using System;
using System.ServiceProcess;

namespace FirmaDigitalWinService
{
    static class Program
    {
        /// <summary>
        /// Punto de entrada principal para la aplicación.
        /// </summary>
        static void Main()
        {
            if (!Environment.UserInteractive)
            {
                ServiceBase[] ServicesToRun;
                ServicesToRun = new ServiceBase[]
                {
                new DigitalSignWindowsService()
                };
                ServiceBase.Run(ServicesToRun);
            }
        }
    }
}
