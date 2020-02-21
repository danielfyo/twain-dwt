using System;
using System.Collections;
using System.Configuration.Install;
using System.IO;
using System.Management;
using System.ServiceProcess;
using System.Windows;

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

        private void LogTransaction(string msg)
        {
            var logMsg = "<<<" + msg + " >>> | " + DateTime.Now + " | " + Environment.NewLine;
            WriteToFile(logMsg);
        }

        public static void WriteToFile(string Message)
        {
            var path = @"C:\Windows\SysWOW64\IoIp\Logs";
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            var filepath = path + "\\Logs\\ServiceLog_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";

            if (!File.Exists(filepath))
                using (var sw = File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            else
                using (var sw = File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
        }

        public override void Commit(IDictionary savedState)
        {
            MessageBox.Show("Iniciando configuración 1");
            try
            {
                var ServiceKeys = Microsoft.Win32.Registry
                    .LocalMachine.OpenSubKey(String.Format(@"System\CurrentControlSet\Services\{0}", "DigitalSignService"), true);

                MessageBox.Show("Obteniendo la clave");

                try
                {
                    var ServiceType = (ServiceType)(int)(ServiceKeys.GetValue("type"));

                    //Service must be of type Own Process or Share Process
                    if (((ServiceType & ServiceType.Win32OwnProcess) != ServiceType.Win32OwnProcess)
                         && ((ServiceType & ServiceType.Win32ShareProcess) != ServiceType.Win32ShareProcess))
                    {
                        throw new Exception("ServiceType must be either Own Process or Shared   Process to enable interact with desktop");
                    }

                    var AccountType = ServiceKeys.GetValue("ObjectName");
                    //Account Type must be Local System
                    if (String.Equals(AccountType, "LocalSystem") == false)
                        throw new Exception("Service account must be local system to enable interact with desktop");
                    //ORing the InteractiveProcess with the existing service type
                    ServiceType newType = ServiceType | ServiceType.InteractiveProcess;
                    ServiceKeys.SetValue("type", (int)newType);
                }
                catch (Exception exce)
                {
                    MessageBox.Show(exce.Message);
                    MessageBox.Show(exce.StackTrace);
                }
                finally
                {
                    ServiceKeys.Close();
                }

                MessageBox.Show("Iniciando configuración 2");

                var service = new System.Management.ManagementObject(
                String.Format("WIN32_Service.Name='{0}'", "DigitalSignService"));
                try
                {
                    var paramList = new object[11];
                    paramList[5] = true;//We only need to set DesktopInteract parameter

                    var output2 = service.InvokeMethod("Change", paramList);

                    MessageBox.Show(output2+"");
                    //if zero is returned then it means change is done.
                    if (output2.ToString() == "0")
                        MessageBox.Show(string.Format("FAILED with code {0}", output2));

                }
                finally
                {
                    service.Dispose();
                }

                MessageBox.Show("Iniciando configuración 3");

                string command = String.Format("sc config {0} type= own type= interact", "DigitalSignService");
                var processInfo = new System.Diagnostics.ProcessStartInfo()
                {
                    //Shell Command
                    FileName = "cmd"
                    ,
                    //pass command as argument./c means carries
                    //out the task and then terminate the shell command
                    Arguments = "/c" + command
                    ,
                    //To redirect The Shell command output to process stanadrd output
                    RedirectStandardOutput = true
                   ,
                    // Now Need to create command window.
                    //Also we want to mimic this call as normal .net call
                    UseShellExecute = false
                  ,
                    // Do not show command window
                    CreateNoWindow = true

                };

                var process = System.Diagnostics.Process.Start(processInfo);

                var output = process.StandardOutput.ReadToEnd();

                MessageBox.Show(output);

                /*if (output.Trim().EndsWith("SUCCESS") == false)
                    throw new Exception(output);*/


                MessageBox.Show("Finalización de la configuración");


                /*ConnectionOptions coOptions = new ConnectionOptions();
                coOptions.Impersonation = ImpersonationLevel.Impersonate;
                ManagementScope mgmtScope = new ManagementScope(@"root\CIMV2", coOptions);
                mgmtScope.Connect();
                ManagementObject wmiService;
                wmiService = new ManagementObject("Win32_Service.Name='DigitalSignService");
                ManagementBaseObject InParam = wmiService.GetMethodParameters("Change");
                InParam["DesktopInteract"] = true;
                ManagementBaseObject OutParam = wmiService.InvokeMethod("Change", InParam, null);*/
            }
            catch (System.Exception exce)
            {
                MessageBox.Show(exce.Message);
                MessageBox.Show(exce.StackTrace);
                LogTransaction(exce.Message);
                LogTransaction(exce.StackTrace);
                throw exce;
            }
        }
    }
}
