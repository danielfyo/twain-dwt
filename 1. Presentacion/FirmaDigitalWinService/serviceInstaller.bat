sc create "IoIpDigitalSign" binpath="C:\Users\danie\OneDrive\Documentos\GitHub\ioip-twain-dwt\1. Presentacion\FirmaDigitalWinService\bin\Debug\FirmaDigitalWinService.exe"

sc delete "IoIpDigitalSignService"

cd "C:\Windows\Microsoft.NET\Framework64\v4.0.30319"

InstallUtil.exe "C:\Windows\SysWOW64\IoIp\FirmaDigitalWinService.exe"

InstallUtil.exe "C:\Windows\SysWOW64\IoIp\FirmaDigitalWinService.exe" /u

InstallUtil.exe "C:\Windows\SysWOW64\IoIp\FirmaDigitalWinService.exe" /usename=".\danie" /password="dFyOl450Yt!"

nc localhost 8000 < "C:\Users\danie\OneDrive\Documentos\prueba ioip\json to serialize.json"

psexec \\localhost -u ".\danie" -p "dFyOl450Yt!\"" -i -h FirmarPdf.exe 60094980-fe6e-4695-9bd0-b5b239ec2c19.json

psexec -i -h -u ".\danie" -p "dFyOl450Yt!\"" \\localhost FirmarPdf.exe 60094980-fe6e-4695-9bd0-b5b239ec2c19.json

psexec \\localhost -i -h FirmarPdf.exe 60094980-fe6e-4695-9bd0-b5b239ec2c19.json

psexec -u ".\danie" -p "dFyOl450Yt!\"" \\localhost FirmarPdf.exe 60094980-fe6e-4695-9bd0-b5b239ec2c19.json

psexec \\localhost FirmarPdf.exe 60094980-fe6e-4695-9bd0-b5b239ec2c19.json

psexec  \\localhost FirmarPdf.exe ce5b3113-c070-4792-8feb-b7e48ff06532.json