import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../hooks/useTheme';
import { useBiometrics } from '../../hooks/useBiometrics';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';

const MOCK_USER: User = {
  id:            'user-1',
  firstName:     'Shai',
  lastName:      'Ali',
  email:         'shai@solarisenterprise.com',
  accountNumber: '4892031847624291',
  cashBalance:   12_480.50,
  kycVerified:   true,
  createdAt:     new Date(Date.now() - 365 * 86400000).toISOString(),
};

export default function LoginScreen() {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const { setUser } = useAuthStore();
  const { authenticate, checkAvailability } = useBiometrics();

  const [email,    setEmail]    = useState('shai@solarisenterprise.com');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [bioType,  setBioType]  = useState<string | null>(null);
  const [showPw,   setShowPw]   = useState(false);

  useEffect(() => {
    checkAvailability().then(({ available, type }) => {
      if (available) setBioType(type);
    });
  }, []);

  const handleBiometric = async () => {
    const success = await authenticate('Sign in to Fintech App');
    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUser(MOCK_USER, 'mock-token-biometric');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUser(MOCK_USER, 'mock-token-password');
  };

  const s = StyleSheet.create({
    safe:    { flex: 1, backgroundColor: colors.bg },
    kav:     { flex: 1 },
    inner:   { flex: 1, justifyContent: 'space-between', padding: spacing.lg },
    top:     { marginTop: spacing.xxl },
    logo:    { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
    logoTx:  { fontSize: fontSize.xxl, color: '#fff', fontWeight: fontWeight.bold },
    title:   { fontSize: fontSize.xxl + 4, fontWeight: fontWeight.extrabold, color: colors.text, letterSpacing: -0.5, marginBottom: spacing.xs },
    subtitle:{ fontSize: fontSize.base, color: colors.textSecondary, lineHeight: 22 },
    form:    { gap: spacing.md },
    label:   { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary, marginBottom: 4 },
    input:   { backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSize.base, color: colors.text },
    inputFocused:{ borderColor: colors.brand },
    pwWrap:  { position: 'relative' },
    pwToggle:{ position: 'absolute', right: spacing.md, top: '50%', transform: [{ translateY: -10 }] },
    pwToggleTx:{ fontSize: fontSize.sm, color: colors.brand, fontWeight: fontWeight.medium },
    forgotRow:{ alignItems: 'flex-end', marginTop: -spacing.xs },
    forgotTx:{ fontSize: fontSize.sm, color: colors.brand, fontWeight: fontWeight.medium },
    loginBtn:{ backgroundColor: colors.brand, borderRadius: radius.md, paddingVertical: spacing.md + 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
    loginTx: { fontSize: fontSize.base, fontWeight: fontWeight.bold, color: '#fff' },
    divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    line:    { flex: 1, height: 1, backgroundColor: colors.border },
    orTx:    { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: fontWeight.medium },
    bioBtn:  { borderWidth: 1.5, borderColor: colors.brand, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
    bioIcon: { fontSize: fontSize.xl },
    bioTx:   { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: colors.brand },
    footer:  { flexDirection: 'row', justifyContent: 'center', gap: 4, paddingBottom: spacing.md },
    footerTx:{ fontSize: fontSize.sm, color: colors.textSecondary },
    signupTx:{ fontSize: fontSize.sm, color: colors.brand, fontWeight: fontWeight.semibold },
    secured: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.md },
    securedTx:{ fontSize: fontSize.xs, color: colors.textMuted },
  });

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.inner}>
          <View style={s.top}>
            <View style={s.logo}>
              <Text style={s.logoTx}>$</Text>
            </View>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Sign in to manage your portfolio</Text>
          </View>

          <View style={s.form}>
            <View>
              <Text style={s.label}>Email Address</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View>
              <Text style={s.label}>Password</Text>
              <View style={s.pwWrap}>
                <TextInput
                  style={s.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity style={s.pwToggle} onPress={() => setShowPw(!showPw)}>
                  <Text style={s.pwToggleTx}>{showPw ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={s.forgotRow}>
              <Text style={s.forgotTx}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.loginBtn} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.loginTx}>Sign In</Text>
              }
            </TouchableOpacity>

            {bioType && (
              <>
                <View style={s.divider}>
                  <View style={s.line} />
                  <Text style={s.orTx}>or</Text>
                  <View style={s.line} />
                </View>
                <TouchableOpacity style={s.bioBtn} onPress={handleBiometric} activeOpacity={0.8}>
                  <Text style={s.bioIcon}>{bioType === 'Face ID' ? '🔒' : '👆'}</Text>
                  <Text style={s.bioTx}>Sign in with {bioType}</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={s.secured}>
              <Text style={s.securedTx}>🔐 256-bit encryption · SOC 2 certified · FDIC insured</Text>
            </View>
          </View>

          <View style={s.footer}>
            <Text style={s.footerTx}>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={s.signupTx}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
