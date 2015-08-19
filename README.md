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

### Fixing the Status Bar

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

## Android Notes

To debug the app in Chrome inspector, you'll need to do the following:

```
edit platforms/android/AndroidManifest.xml

# Add this debuggable attribute
# <application android:debuggable="true" ...
```

You'll want to build the android app _without_ the --release flag.

Then run the app, and visit `chrome://inspect/#devices` from your desktop Chrome instance. In the listing this app should be available.
