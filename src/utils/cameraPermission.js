import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

/**
 * Ensure camera permission is granted before launching the camera.
 *
 * The app declares android.permission.CAMERA in its manifest, so
 * react-native-image-picker requires the runtime grant on Android before
 * launchCamera will work. On iOS the system prompt is driven by
 * NSCameraUsageDescription and handled by the picker itself, so we just
 * resolve true here.
 *
 * @returns {Promise<boolean>} true if the camera may be used.
 */
export const ensureCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'EliteSewa needs access to your camera to capture photos.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access for EliteSewa in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }

    return false;
  } catch (error) {
    console.warn('Camera permission request failed:', error);
    return false;
  }
};

export default ensureCameraPermission;
