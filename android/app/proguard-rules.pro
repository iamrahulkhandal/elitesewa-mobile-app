# React Native ProGuard Rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class com.facebook.flipper.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep React Native modules
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keep class * extends com.facebook.react.bridge.BaseJavaModule { *; }

# Razorpay
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

# Google Pay (Razorpay dependency)
-dontwarn com.google.android.apps.nbu.paisa.inapp.client.api.PaymentsClient
-dontwarn com.google.android.apps.nbu.paisa.inapp.client.api.Wallet
-dontwarn com.google.android.apps.nbu.paisa.inapp.client.api.WalletUtils
-dontwarn proguard.annotation.Keep
-dontwarn proguard.annotation.KeepClassMembers

# Google Maps
-keep class com.google.android.gms.** { *; }
-keep class com.google.maps.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }
