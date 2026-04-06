import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { COLORS } from '../../../src/utils/theme';

const SETTINGS_ROWS = [
  { label: 'Profile & KYC',         icon: '👤' },
  { label: 'Security & Biometrics', icon: '🔐' },
  { label: 'Notifications',         icon: '🔔' },
  { label: 'Payment Methods',       icon: '💳' },
  { label: 'Tax Documents',         icon: '📄' },
  { label: 'Linked Bank Accounts',  icon: '🏦' },
  { label: 'Help & Support',        icon: '💬' },
  { label: 'Privacy Policy',        icon: '📋' },
];

export default function SettingsTab() {
  const logout = useAuthStore((s) => s.logout);
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? COLORS.dark : COLORS.light;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, margin: 24, marginBottom: 16 }}>
        Settings
      </Text>

      <View style={{
        backgroundColor: colors.card,
        borderRadius:    16,
        marginHorizontal: 16,
        borderWidth:     1,
        borderColor:     colors.cardBorder,
        overflow:        'hidden',
      }}>
        {SETTINGS_ROWS.map((row, i) => (
          <View key={row.label}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 20 }}>{row.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: colors.text }}>
                {row.label}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
            {i < SETTINGS_ROWS.length - 1 && (
              <View style={{ height: 1, backgroundColor: colors.divider, marginHorizontal: 16 }} />
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={logout}
        activeOpacity={0.8}
        style={{
          marginHorizontal: 16,
          marginTop:        16,
          padding:          16,
          backgroundColor:  colors.dangerLight,
          borderRadius:     12,
          alignItems:       'center',
        }}
      >
        <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', color: colors.textMuted, fontSize: 11, marginTop: 24 }}>
        Fintech App v1.0.0 · Build 100
      </Text>
    </SafeAreaView>
  );
}
