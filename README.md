# AMS2.SKIN HUD
A custom HUD for AMS2.

## Why?
The in game HUD does a fine job... until it doesn't. Alignment issues especially with VR were the main problem for me. Starting off as just an alterative HUD for Automobilista 2, the project soon grew into two parts.   
I wanted a clean looking HUD just for me without it beind recorded or streamed.   
**Part 1** achieves that goal, it is a good looking HUD with all the info I need and nothing I don't, allowing me to focus on driving without distration.   
**Part 2** is a view I share on my recordings, with the aim of making it feel like a genuine broadcast rather than just a recording of my gameplay.   

## Quick start
- Download the supplied binary (.exe) under releases.
- Install it and open the AMS2HUD.
- If you get a securty prompt about Crest2 *(most likely on first launch)* then this is quite safe. More details below but AMS2HUD won't run successfully without it.
- You should be greeted with the settings menu on launch, You don't need to touch anything here at the moment if running on the same machine as the game.
- Start Automobilista 2.
- Once the HUD settings indicate you're connected *Usually just before the game loads into the main menu*. It is now safe to close the settings menu and go to the track.

## System Tray
AMS2HUD has a system tray tool which is where you can open the settings menu when you need to.

## Settings
IP address and port are for connecting to the Crest service. Crest is built into this app. running on port `8881` but you can also run it externally if you prefer.  
You'll find the standalone package below.

### Windows System Tray Bug
Ever noticed how some system tray icons simply don't show properly when you click them?  
Sometimes they open behind the taskbar, sometimes they don't open at all. It drives me up the wall! 
A simple fix I discovered whilst building this app was to move the system tray icon into the "hidden icon menu" and access it from there instead.

## Crest2
More info can be found here: https://github.com/viper4gh/CREST2-AMS2 but essentially, Crest2 is the brain of this HUD, gathering the data and converting it to JSON format.  
Thank you to [NLxAROSA](https://github.com/NLxAROSA/CREST) for the original Crest and also to [viper4gh](https://github.com/viper4gh/CREST2-AMS2) for maintaining the package for use with AMS2. 

