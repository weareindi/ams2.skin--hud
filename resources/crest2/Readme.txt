CREST2 - CARS2 REST API v1.0.1
(C) 2015 Lars Rosenquist
	updated by Viper

If you are reading this file it means you have successfully downloaded and extracted CREST2! To run the application:

Included files:
***************
CREST2.exe			- Binary
zlibwapi.dll			- Library for data compression
CREST2_Example.json		- Example how the browser output looks like
CREST2_Example_formatted.json	- Example how the browser output looks like - formatted for better readability
example.html			- Example how you can use the API in HTML
			  	It requests the data from localhost, you have to open it on the same system where the CREST2.exe is running. If you want to open it on another system in your local network, you have to replace localhost by the ip address where the CREST2.exe is running.
			  	If you open the browser developer console and click the "Request" link, the console ouputs the complete Shared Memory data.


Usage
*****
1. Double click the CREST2 executable file, or execute from the command line.
2. Open a browser (preferrably Chrome or Firefox) or your favorite REST or HTTP client and go to http://localhost:8180/crest2/v1/api. 
   The browser and CREST2 have to run on the same system in this case, because the browser requests localhost. 

This should give a JSON response with a notification that AMS 2 is not running or Shared Memory is not enabled. So:

3. Start Automobilista 2.
4. Go to Options -> System -> Shared Memory and set it to "Project CARS2"
5. Repeat step 2 and use http://localhost:8180/crest2/v1/api?formatted=true for better readability
6. Success!

You have to run CREST2 on the system where Automobilista 2 runs, but you can open the Website from another system in your network, too. 
Then you have to replace localhost by the IP address of your gaming PC where CREST2 runs, e.g. http://192.168.0.5:8180/crest2/v1/api
And don't forget, the Windows Firewall is maybe blocking the request. 

Command Line Options
********************
CREST2.exe [-p 8180] [-t 17] [-d[d]] [-h]
  -p    TCP Port, default: 8180, allowed: 1025-65534
  -t    Websocket Timeout im ms, default: 17, allowed: 1-10000
  -d    Debug Level 1, show some more info for Integrity Checks
  -dd   Debug Level 2, show more info for Integrity Checks
  -h    Help

FAQ
***
Q: When trying to run CREST2, Windows complains about security and it won't start.
A: I didn't sign the binary, so Windows will not allow the binary to start by default. Please allow/unblock it to allow operation.

Q: When trying to run CREST2, Windows complains about missing DDLs (e.g. MSVCR120.DLL or similar)
A: Download and install the Visual C++ runtime from  https://www.visualstudio.com/de/downloads/ (vcredist_x86.exe, scroll down to "Other Tools and Frameworks") and try again.

Q: When trying to run CREST2, Windows Firewall asks for network access.
A: CREST2 needs to access the local network, or you can't access it. Please allow access.


