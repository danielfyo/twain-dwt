import Dynamsoft from 'dwt';

Dynamsoft.WebTwainEnv.AutoLoad = false;
Dynamsoft.WebTwainEnv.ResourcesPath = 'https://demo.dynamsoft.com/DWT/Resources';
Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '504px', Height: '600px' },{ ContainerId: 'dwtcontrolContainerLarger', Width: '504px', Height: '600px' }];
Dynamsoft.WebTwainEnv.ProductKey = "t0140cQMAAE8LWxVAHxlESW7JnSwHi4Gr4r8Df5baQ3boMjBgBMs//zRwatGJL1nxpE28FANXQu6g5e+JrEeOe47+lYwiv8iO4Z3pu9BZTJhMHw0Mvb9eu7E/puvPXOr0WSu+KDZMGIuNhHkIb/aGOPNpmDAWGwnzJDIfRddowjBhLDaCe2NaWy3NPlCFrqA=";// "t0070QQAAAD31luWIE5pROif90xJ9IShjcA0HIIiYpQco6rlnpQjYJU/TcbmVnhFlO0uGsGioWPxt2sQF8oLOk8kwxmAJ8R8QAQ==";
Dynamsoft.WebTwainEnv.Trial = true;
Dynamsoft.WebTwainEnv.IfAddMD5InUploadHeader = false;
Dynamsoft.WebTwainEnv.IfConfineMaskWithinTheViewer = false;


Dynamsoft.WebTwainEnv.OnWebTwainInitMessage = function (errorString, errorCode) {
    if (errorCode !== 1) {
        var msg = errorString;
        if (errorCode === 5) {
            msg = "Por favor reinicie el explorador.";
            alert(msg);
        }
        console && console.error(msg);
    }
};

export default Dynamsoft;