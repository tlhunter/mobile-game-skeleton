# Mobile Game Skeleton

This project was created by <a href="https://github.com/tlhunter">Thomas Hunter II</a> as a proof of concept for building cross-platform games using <a href="https://cordova.apache.org/">Apache Cordova</a>. Specifically this project can be used to build for Web/Firefox OS _without_ the need to have Cordova installed. Otherwise, building for iOS and Android will require Cordova.

This engine takes a hybrid approach to game development. Menus with button-based navigation are built using familiar HTML and CSS. Navigation involved hiding and showing various screens. Actual game-loop rendering takes place on a dedicated canvas.


## Play the Original Game

If you're interested in how this game looks and performs on your device:

* [Strategic Game of Life in Web Browser](http://zyu.me/apps/sgol)
* [Strategic Game of Life on Google Play](https://play.google.com/store/apps/details?id=name.thomashunter.strategicgol)
* [Strategic Game of Life on Firefox Marketplace](https://marketplace.firefox.com/app/strategic-gol)
* [Strategic Game of Life on iOS App Store](https://itunes.apple.com/us/app/strategic-game-of-life/id1033673016)
* [Strategic Game of Life on Amazon Appstore](http://amzn.to/1NqEtsc)


## Commands

### Getting Started (Build for Web)

First grab all the necessary files:

```bash
npm install -g gulp
npm install
```

Then run the sample server

```bash
cd server
node ./sgol.js
```

In another terminal run a build for the website

```bash
gulp build-web
```

Finally, open http://localhost:1337 in your web browser and play a sample game.

### Building With Cordova

Project was built using `cordova@5.3.3`, your mileage may vary with different versions.

#### Install Cordova

```bash
npm install -g cordova
```

#### Build Entire Project

Use a different command based on the environment you want to build for:

```bash
gulp build-ios
gulp build-android
gulp build-web
```

#### Build Sub Components

Compiles one of the types `scripts`, `styles`, `html`, or if omitted, all of them.

```bash
gulp <type>
```

#### Automatic Rebuild

Compiles all three types, then when any change occurs, recompiles. You probably want to do this after `gulp build-web` for testing locally.

```bash
gulp watch
```

#### Download Data

Download data from the CMS to tmp/data.json. Needed for Cordova build steps.

```bash
gulp data
```

## Forking Guide

This isn't a library you can simply download and start using, it's actually a complete game. If you want to build a whole new game using this as a base, you'll want to keep the following in mind:

 * CMS uses [Grille](https://www.npmjs.com/package/grille), though you can edit the JSON by hand
  * If demand is high enough I'll include a copy of the original spreadsheet
 * Create a Mixpanel account (or remove any occurrence of `analytics`)
 * Create a Ad Mob account (or remove any occurrence of `interstitial`)


## Platform Specific Notes

Cordova, unfortunately, isn't perfect. Listed below is a bunch of platform-specific hacks one needs to employ when building this project.

### iOS Hacks

I recommend you read the [Cordova iOS Getting Started Guide](https://cordova.apache.org/docs/en/2.5.0/guide/getting-started/ios/).

You'll want to load the included Xcode Project to perform builds.

#### Fixing Validation in Xcode

##### Symptom

When performing the validation step before submitting the app to Apple a validation error occurs.

##### Solution

Change the Info > Bundle Identifier to:

```
name.thomashunter.sgol
```

The default one, `name.thomashunter.strategicgol`, was deemed too long by Apple and had to change, so now it's different from Android and iOS.

#### Fixing the Status Bar

##### Symptom

The status bar is visible on the top of the screen and occludes some of the content

##### Solution

Patch the following file:

```
platforms/ios/Game of Life/Classes/MainViewController.m
```

Add the following inside of `MainViewController`:

```objc
//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden
{
    return YES;
}
```

#### Fixing Audio Playback

##### Symptom

Music does not play in the game. The following error is also visible in the Xcode debug log:

```
Deactivating an audio session that has running I/O.
All I/O should be stopped or paused prior to deactivating the audio session.
```

##### Solution

Patch the following file:

```
/platforms/ios/Game of Life/Plugins/org.apache.cordova.media/CDVSound.m
```

Then, you'll want to comment out part of the `audioPlayerDidFinishPlaying` function:

```objc
/*
if (self.avSession) {
    [self.avSession setActive:NO error:nil];
}
*/
```

##### Further Reading

https://issues.apache.org/jira/browse/CB-7599

### Android Notes

I recommend you read the [Cordova Android Getting Started Guide](https://cordova.apache.org/docs/en/2.5.0/guide/getting-started/android/).

Luckily the entire process of building your Android APK can be automated using the command line. Check out `bin/sign-android.sh` for an example on how to sign your APK.

#### Debugging

To debug the app in Chrome inspector, you'll need to edit the following:

```
platforms/android/AndroidManifest.xml
```

Add this debuggable attribute

```xml
<application android:debuggable="true" ...>
```

You'll want to build the android app _without_ the --release flag.

Then run the app, and visit `chrome://inspect/#devices` from your desktop Chrome instance. In the listing this app should be available.


## Licenses

This project itself is released under the **MIT** license.

* The framework [Apache Cordova](https://cordova.apache.org) uses the Apache license
* The font [Retro Computer](http://www.dafont.com/retro-computer.font) by [Szabó-Lencz Péter](http://www.petyka.com) requires a donation for commercial use
* The music [OutThere.ogg](http://opengameart.org/content/space-music-out-there) is CC0
* The music [Evasion.ogg](http://opengameart.org/content/evasion) is CC-BY 3.0
* Files in `src/script/lib/*.js` each contain their own license information
