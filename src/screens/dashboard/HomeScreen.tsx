import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import { usePortfolioStore } from '../store/portfolioStore';
import { AssetCard } from '../components/ui/AssetCard';
import { TransactionItem } from '../components/ui/TransactionItem';
import { formatCurrency, formatPercent, maskAccountNumber } from '../utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PERIODS = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;

const QUICK_ACTIONS = [
  { id: 'deposit',  label: 'Add Funds',  icon: '↓' },
  { id: 'send',     label: 'Send',       icon: '↑' },
  { id: 'buy',      label: 'Buy',        icon: '+' },
  { id: 'history',  label: 'History',    icon: '☰' },
];

export default function HomeScreen() {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const user      = useAuthStore((s) => s.user);
  const { portfolio, transactions, watchlist, isLoading, selectedPeriod, loadPortfolio, setPeriod, refreshPrices } = usePortfolioStore();

  useEffect(() => {
    loadPortfolio();
    const interval = setInterval(refreshPrices, 30_000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => { loadPortfolio(); }, []);

  const isPositiveDay = (portfolio?.dayChangePercent ?? 0) >= 0;
  const isPositiveTotal = (portfolio?.totalGainPercent ?? 0) >= 0;

  const s = StyleSheet.create({
    safe:    { flex: 1, backgroundColor: colors.bg },
    scroll:  { flex: 1 },
    header:  { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    greeting:{ fontSize: fontSize.base, color: colors.textSecondary, fontWeight: fontWeight.medium },
    name:    { fontSize: fontSize.lg, color: colors.text, fontWeight: fontWeight.bold },
    avatar:  { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
    avatarTx:{ fontSize: fontSize.sm, color: '#fff', fontWeight: fontWeight.bold },
    balanceCard: { marginHorizontal: spacing.lg, marginVertical: spacing.md, backgroundColor: colors.brand, borderRadius: radius.xl, padding: spacing.lg },
    accountLabel:{ fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.xs },
    accountNum:  { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)', fontWeight: fontWeight.medium, marginBottom: spacing.lg },
    balanceLabel:{ fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.xs },
    balanceValue:{ fontSize: fontSize.hero, color: '#fff', fontWeight: fontWeight.extrabold, letterSpacing: -1 },
    changeRow:   { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
    changeTx:    { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.9)', fontWeight: fontWeight.semibold },
    portfolioCard: { marginHorizontal: spacing.lg, backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.lg, marginBottom: spacing.md },
    sectionTitle:{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, marginHorizontal: spacing.lg, marginBottom: spacing.md, marginTop: spacing.sm },
    periodRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
    periodBtn:   { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full },
    periodTx:    { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
    quickActions:{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: spacing.lg, marginBottom: spacing.lg },
    qaBtn:       { alignItems: 'center' },
    qaIcon:      { width: 52, height: 52, borderRadius: radius.full, backgroundColor: colors.bgTertiary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
    qaIconTx:    { fontSize: fontSize.xl, color: colors.brand },
    qaLabel:     { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium },
    divider:     { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
    assetList:   { paddingHorizontal: spacing.lg, gap: spacing.sm },
    emptyTx:     { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.sm, paddingVertical: spacing.xl },
    txCard:      { backgroundColor: colors.card, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.cardBorder, marginHorizontal: spacing.lg, overflow: 'hidden' },
    seeAll:      { fontSize: fontSize.sm, color: colors.brand, fontWeight: fontWeight.semibold },
    sectionRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: spacing.lg, marginBottom: spacing.md, marginTop: spacing.sm },
  });

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'SA';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.brand} />}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning,</Text>
            <Text style={s.name}>{user?.firstName ?? 'Shai'} 👋</Text>
          </View>
          <TouchableOpacity style={s.avatar}>
            <Text style={s.avatarTx}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <View style={s.balanceCard}>
          <Text style={s.accountLabel}>Cash Balance</Text>
          <Text style={s.accountNum}>{maskAccountNumber(user?.accountNumber ?? '••••4291')}</Text>
          <Text style={s.balanceLabel}>Available Cash</Text>
          <Text style={s.balanceValue}>{formatCurrency(user?.cashBalance ?? 12_480.50)}</Text>
          <View style={s.changeRow}>
            <Text style={s.changeTx}>
              {isPositiveDay ? '▲' : '▼'}{' '}
              {formatCurrency(Math.abs(portfolio?.dayChange ?? 0))} today ({formatPercent(portfolio?.dayChangePercent ?? 0)})
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={s.quickActions}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity key={a.id} style={s.qaBtn} activeOpacity={0.7}>
              <View style={s.qaIcon}>
                <Text style={s.qaIconTx}>{a.icon}</Text>
              </View>
              <Text style={s.qaLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Portfolio summary */}
        <View style={s.portfolioCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <View>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Portfolio Value</Text>
              <Text style={{ fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, color: colors.text, marginTop: 2 }}>
                {formatCurrency(portfolio?.totalValue ?? 0)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Total Return</Text>
              <Text style={{ fontSize: fontSize.md, fontWeight: fontWeight.bold, color: isPositiveTotal ? colors.success : colors.danger, marginTop: 2 }}>
                {formatPercent(portfolio?.totalGainPercent ?? 0)}
              </Text>
              <Text style={{ fontSize: fontSize.xs, color: isPositiveTotal ? colors.success : colors.danger }}>
                {isPositiveTotal ? '+' : ''}{formatCurrency(portfolio?.totalGain ?? 0)}
              </Text>
            </View>
          </View>

          {/* Period selector */}
          <View style={s.periodRow}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[s.periodBtn, { backgroundColor: selectedPeriod === p ? colors.brand : colors.bgTertiary }]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.7}
              >
                <Text style={[s.periodTx, { color: selectedPeriod === p ? '#fff' : colors.textSecondary }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sparkline placeholder */}
          <View style={{ height: 80, backgroundColor: colors.bgTertiary, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Chart (Victory Native / Skia)</Text>
          </View>
        </View>

        {/* Holdings */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Holdings</Text>
          <TouchableOpacity><Text style={s.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={s.assetList}>
          {(portfolio?.assets ?? []).slice(0, 4).map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </View>

        {/* Recent transactions */}
        <View style={[s.sectionRow, { marginTop: spacing.lg }]}>
          <Text style={s.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity><Text style={s.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={s.txCard}>
          {transactions.slice(0, 5).map((tx, i) => (
            <View key={tx.id}>
              <TransactionItem transaction={tx} />
              {i < 4 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}
