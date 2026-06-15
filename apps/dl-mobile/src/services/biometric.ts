import * as LocalAuthentication from 'expo-local-authentication';

export const biometricService = {
  isSupported: async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },

  authenticate: async (promptMessage = 'Authenticate to continue') => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });
    return result.success;
  },

  getSupportedTypes: async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return types.map((type) => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          return 'Fingerprint';
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          return 'Face ID';
        case LocalAuthentication.AuthenticationType.IRIS:
          return 'Iris';
        default:
          return 'Biometrics';
      }
    });
  },
};
