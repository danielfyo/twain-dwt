using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace Funciones.SocketServer
{
    public class SocketServer
    {
        public ManualResetEvent allDone;
        private readonly Func<string, Socket, bool> _parentDelegateFuntion;
        Socket _listener;
        public SocketServer(Func<string, Socket, bool> parentDelegateFuntion)
        {
            _parentDelegateFuntion = parentDelegateFuntion;
            allDone = new ManualResetEvent(false);
        }

        public void StopServer()
        {
            try
            {
                _listener.Disconnect(false);
            }
            catch (Exception exce)
            {

            }
            _listener.Close();
            _listener.Dispose();
        }

        public void StartServer(int port)
        {
            var ipHostInfo = Dns.GetHostEntry(Dns.GetHostName());
            var ipAddress = ipHostInfo.AddressList[1];
            var localEndPoint = new IPEndPoint(IPAddress.Any, port);

            
            _listener = new Socket(ipAddress.AddressFamily,
                SocketType.Stream, ProtocolType.Tcp);

            try
            {
                _listener.Bind(localEndPoint);
                _listener.Listen(100);

                while (true)
                {
                    allDone.Reset();

                    Console.WriteLine("Esperando conexión...");
                    _listener.BeginAccept(
                        new AsyncCallback(AcceptCallback),
                        _listener);

                    allDone.WaitOne();
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }

            Console.WriteLine("\nPresione enter para continuar...");
            Console.Read();

        }

        public void AcceptCallback(IAsyncResult ar)
        {
            allDone.Set();

            var listener = (Socket)ar.AsyncState;
            var handler = listener.EndAccept(ar);

            var state = new StateObject();
            state.workSocket = handler;
            handler.BeginReceive(state.buffer, 0, StateObject.BufferSize, 0,
                new AsyncCallback(ReadCallback), state);
        }

        public void ReadCallback(IAsyncResult ar)
        {
            var content = string.Empty;

            var state = (StateObject)ar.AsyncState;
            var handler = state.workSocket;

            var bytesRead = handler.EndReceive(ar);

            if (bytesRead > 0)
            {
                state.sb.Append(Encoding.ASCII.GetString(
                    state.buffer, 0, bytesRead));

                content += state.sb.ToString();
                if (content.IndexOf("<EOF>") > -1)
                {
                    Console.WriteLine("Read {0} bytes from socket. \n Data : {1}",
                        content.Length, content);
                    var result = _parentDelegateFuntion(content, handler);
                    //Send(handler, content);
                }
                else
                {
                    handler.BeginReceive(state.buffer, 0, StateObject.BufferSize, 0,
                    new AsyncCallback(ReadCallback), state);
                }
            }
        }

        public void Send(Socket handler, String data)
        {
            byte[] byteData = Encoding.ASCII.GetBytes(data);

            handler.BeginSend(byteData, 0, byteData.Length, 0,
                new AsyncCallback(SendCallback), handler);
        }

        private void SendCallback(IAsyncResult ar)
        {
            try
            {
                var handler = (Socket)ar.AsyncState;

                var bytesSent = handler.EndSend(ar);
                Console.WriteLine("Sent {0} bytes to client.", bytesSent);

                handler.Shutdown(SocketShutdown.Both);
                handler.Close();
            }
            catch (Exception e)
            { 
                Console.WriteLine(e.ToString());
            }
        }
    }
}
