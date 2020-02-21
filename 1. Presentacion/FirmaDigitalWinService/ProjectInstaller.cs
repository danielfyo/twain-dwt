using System.Configuration.Install;
using System.ServiceProcess;

namespace FirmaDigitalWinService
{
    public partial class ProjectInstaller : Installer
    {
        public ProjectInstaller()
        {
            ServiceProcessInstaller pi = new ServiceProcessInstaller();
            ServiceInstaller si = new ServiceInstaller();

            //Launching into another session like this requires the service
            //account to have the SE_TCB_NAME (Act as part of the operating 
            //system) privilege. By default only the loacl system account 
            //has this privilege.
            pi.Account = ServiceAccount.LocalSystem;
            si.ServiceName = "DigitalSignService";
            si.Description = "Launches interactive sessions processes to sign a pdf file.";
            si.DisplayName = "IoIp Digital sign service";

            this.Installers.AddRange(new Installer[] { pi, si });
            //InitializeComponent();    
        }
    }
}
