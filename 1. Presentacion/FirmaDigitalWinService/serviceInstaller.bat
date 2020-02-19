sc create "IoIpDigitalSignService" binpath="C:\Users\danie\OneDrive\Documentos\GitHub\ioip-twain-dwt\1. Presentacion\FirmaDigitalWinService\bin\Debug\FirmaDigitalWinService.exe"
sc delete "IoIpDigitalSignService"
nc 192.168.0.37 9000 < "C:\Users\danie\OneDrive\Escritorio\json to serialize.json"