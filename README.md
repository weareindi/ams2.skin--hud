# AMS2HUD
A custom HUD for AMS2.   

[![AMS2 Custom HUD](https://i.ytimg.com/vi/D6_VJDpU-1k/maxresdefault.jpg)](https://youtu.be/D6_VJDpU-1k "AMS2 Custom HUD")
![AMS2HUD_pitbox_compressed](https://github.com/user-attachments/assets/3f36273e-b05f-440a-bac3-bbf5e8beba73)

## Download
[Click here to download latest release](https://github.com/weareindi/ams2.skin--hud/releases/latest)

## Why?
The in game HUD does a fine job... until it doesn't. Alignment issues especially with VR were the main problem for me. Starting off as just an alterative HUD for Automobilista 2, the project soon grew into two parts.   
I wanted a clean looking HUD just for me without it being recorded or streamed.   
**Part 1** achieves that goal, it is a good looking HUD with all the info I need and nothing I don't, allowing me to focus on driving without distraction.   
**Part 2** is a view I share on my recordings, with the aim of making it feel like a genuine broadcast rather than just a recording of my gameplay.   

## Quick start
- Download the supplied binary (.exe) under releases.
- Install it and open the AMS2HUD.
- If you get a securty prompt about Crest2 *(most likely on first launch)* then this is quite safe. More details below but AMS2HUD won't run successfully without it.
- You should be greeted with the settings menu on launch, You don't need to touch anything here at the moment if running on the same machine as the game.
- Start Automobilista 2.
- Once the HUD settings indicate you're connected *Usually just before the game loads into the main menu*. It is now safe to close the settings menu and go to the track.

## Requirements
- This HUD runs on a layer over the top of the game window. It does NOT get injected into the game. Please run the game in windowed or borderless view. Running AMS2 in fullscreen prevents this HUD from being seen. (Please get in touch if you're a developer who knows how to inject this HUD into the game so it can run in fullscreen view)

## System Tray
AMS2HUD has a system tray tool which is where you can open the settings menu when you need to.

## Settings
Default tick rate is 24. This is perfect for most use cases.

## Windows System Tray Bug
Ever noticed how some system tray icons simply don't show properly when you click them?  
Sometimes they open behind the taskbar, sometimes they don't open at all. It drives me up the wall! 
A simple fix I discovered whilst building this app was to move the system tray icon into the "hidden icon menu" and access it from there instead.

## Crest2
More info can be found here: https://github.com/viper4gh/CREST2-AMS2 but essentially, Crest2 is the brain of this HUD, gathering the data and converting it to JSON format.  
Thank you to [NLxAROSA](https://github.com/NLxAROSA/CREST) for the original Crest and also to [viper4gh](https://github.com/viper4gh/CREST2-AMS2) for maintaining the package for use with AMS2. 

---

## Help Required
- As mentioned above, I'd like to be able to offer this HUD to players that run fullscreen (as opposed to windowed/borderless). If you can help with that, please get in touch.
- I'd also like to be able to inject this into VR views for SteamVR and Oculus users. If you know how to do that and can point me in the correct direction, please get in touch.
- Crest2 really is brilliant and allowed me to get this HUD up and running very quickly but I'd like to remove the need for Crest2 and access the shared memory direcly from AMS2 to improve performance. This app is build on Node/Electron. If you can point me in the correct direction to get that implemented, please get in touch.

Many thanks,
Loz
