#!/bin/sh

# keytool -genkey -v -keystore thomashunter-mobile.keystore -alias thomashuntermobile -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore thomashunter-mobile.keystore ./platforms/android/build/outputs/apk/android-release-unsigned.apk thomashuntermobile
zipalign -v 4 ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./platforms/android/build/outputs/apk/strategic-game-of-life-signed.apk
