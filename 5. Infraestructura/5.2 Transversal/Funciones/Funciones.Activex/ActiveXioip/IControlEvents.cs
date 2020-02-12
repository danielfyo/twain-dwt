using System;
using System.Runtime.InteropServices;

namespace ActiveXioip
{
    [Guid("68BD4E0D-D7BC-4cf6-BEB7-CAB950161E79")]
    [InterfaceType(ComInterfaceType.InterfaceIsIDispatch)]
    public interface IControlEvents
    {
        //Add a DispIdAttribute to any members in the source interface to specify the COM DispId.
        [DispId(0x60020001)]
        void OnClose(string redirectUrl); //This method will be visible from JS
    }
}
