import Dynamsoft from 'dwt';

Dynamsoft.WebTwainEnv.AutoLoad = false;
Dynamsoft.WebTwainEnv.ResourcesPath = 'https://demo.dynamsoft.com/DWT/Resources';
Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '504px', Height: '600px' }];
Dynamsoft.WebTwainEnv.ProductKey = "t0068NQAAAIecyQUtOUsaAdim+KajYTQriVuwXDocZbcKaQh0CgPPb4/ihfXmW1eKe6mrSLZdZUgtMi6JaoumGGp8NDD93sI=";// "t0070QQAAAD31luWIE5pROif90xJ9IShjcA0HIIiYpQco6rlnpQjYJU/TcbmVnhFlO0uGsGioWPxt2sQF8oLOk8kwxmAJ8R8QAQ==";
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