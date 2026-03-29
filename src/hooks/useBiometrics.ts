import { useState, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export function useBiometrics() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const checkAvailability = useCallback(async (): Promise<{
    available: boolean;
    type: string;
  }> => {
    const hasHardware  = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled   = await LocalAuthentication.isEnrolledAsync();
    const types        = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (!hasHardware || !isEnrolled) {
      return { available: false, type: 'none' };
    }

    const hasFaceId = types.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    );

    return {
      available: true,
      type: hasFaceId ? 'Face ID' : 'Touch ID',
    };
  }, []);

  const authenticate = useCallback(
    async (prompt = 'Authenticate to continue'): Promise<boolean> => {
      setIsAuthenticating(true);
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: prompt,
          cancelLabel:   'Use Password',
          fallbackLabel: 'Use Password',
          disableDeviceFallback: false,
        });
        return result.success;
      } catch {
        return false;
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  return { authenticate, checkAvailability, isAuthenticating };
}
