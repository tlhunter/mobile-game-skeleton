# Strategic Game of Life

## Commands

    cordova build <platform>

Builds the specified platform, namely `ios`, `android`, and `firefoxos`.

TODO: Handle this entirely using gulp

    gulp <type>

Compiles one of the types `scripts`, `styles`, `html`, or if omitted, all of them.

    gulp watch

Compiles all three types, then when any change occurs, recompiles.

    gulp data

Download data from the CMS to tmp/data.json. Needed for cordova build steps.

TODO: Where is this data downloaded from?

## iOS Notes

### Fixing Validation in Xcode

#### Symptom

When performing the validation step before submitting the app to Apple a validation error occurs.

#### Solution

Change the Info > Bundle Identifier to:

```
name.thomashunter.sgol
```

The default one, `name.thomashunter.strategicgol`, was deemed too long by Apple and had to change, so now it's different from Android and iOS.

### Fixing the Status Bar

#### Symptom

The status bar is visible on the top of the screen and occludes some of the content

#### Solution

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

### Fixing Audio Playback

#### Symptom

Music does not play in the game. The following error is also visible in the Xcode debug log:

```
Deactivating an audio session that has running I/O.
All I/O should be stopped or paused prior to deactivating the audio session.
```

#### Solution

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

#### Further Reading

https://issues.apache.org/jira/browse/CB-7599

## Android Notes

To debug the app in Chrome inspector, you'll need to do the following:

```
edit platforms/android/AndroidManifest.xml

# Add this debuggable attribute
# <application android:debuggable="true" ...
```

You'll want to build the android app _without_ the --release flag.

Then run the app, and visit `chrome://inspect/#devices` from your desktop Chrome instance. In the listing this app should be available.
