import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { COLORS } from '../../src/utils/theme';

export default function PortfolioTab() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? COLORS.dark : COLORS.light;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Portfolio</Text>
        <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 13 }}>Holdings breakdown + Victory Native chart</Text>
      </View>
    </SafeAreaView>
  );
}
