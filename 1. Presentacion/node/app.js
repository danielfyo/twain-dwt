var exec = require('child_process').execFile;

var fun =function(){
   console.log("fun() start");
   exec('FirmarPdf.exe', function(err, data) {  
        console.log(err)
        console.log(data.toString());                       
    }); 
}
//fun();
var msg = 'Hello World';
console.log(msg);
fun();