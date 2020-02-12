using System;
using System.Runtime.InteropServices;

namespace ActiveXioip
{
    [Guid("68BD4E0D-D7BC-4cf6-BEB7-CAB950161E79")]
    [InterfaceType(ComInterfaceType.InterfaceIsIDispatch)]
    public interface IControlEvents
    {
        [DispId(0x60020001)]
        void OnClose(string redirectUrl); 
    }
}
