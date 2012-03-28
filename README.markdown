Native components as HTML5-WebApp (works on Android only)
====================================
Implemented so far:
-------------------
*	Multitouch to change a visible object (move (1 finger), pinch to zoom (2 fingers), rotate (3 fingers))
*	Accelerometer to roll the ball 
*	List including infinite scrolling and pull to refresh with Twitter Interface

Debugging in Browser:
Run debug.html

Run on Android Device:
in your onCreate(Bundle savedInstance)
super.loadUrl("file:///android_asset/www/index.android.html");
