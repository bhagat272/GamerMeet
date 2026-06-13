# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Keep line numbers for debugging (optional but useful)
-keepattributes SourceFile,LineNumberTable

# React Native / Hermes
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.** { *; }
-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.ReactPackage { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

# Prevent warnings for React Native
-dontwarn com.facebook.react.**

# AndroidX (if using Jetpack libs)
-dontwarn androidx.**

# Keep OkHttp (React Native networking depends on it)
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }

# Keep Gson (if you use it, many RN libs depend on it)
-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# Keep Retrofit / Moshi (if using)
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**

# Google Play Services (if using Maps, Ads, Firebase, etc.)
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**

# JSC (if Hermes disabled & fallback to JSC)
-keep class org.webkit.** { *; }
-dontwarn org.webkit.**

# (Optional) Keep your own models if you use reflection
# -keep class com.gamermeet.models.** { *; }
