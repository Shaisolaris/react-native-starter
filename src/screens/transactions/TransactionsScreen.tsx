import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { usePortfolioStore } from '../../store/portfolioStore';
import { TransactionItem } from '../../components/ui/TransactionItem';
import { formatDate, formatCurrency } from '../../utils/format';
import { parseISO, format } from 'date-fns';
import type { Transaction, TransactionType } from '../../types';

const FILTERS: Array<{ label: string; value: TransactionType | 'all' }> = [
  { label: 'All',         value: 'all' },
  { label: 'Buys',        value: 'buy' },
  { label: 'Sells',       value: 'sell' },
  { label: 'Deposits',    value: 'deposit' },
  { label: 'Withdrawals', value: 'withdrawal' },
];

function groupByDate(txs: Transaction[]): Array<{ title: string; data: Transaction[] }> {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach((tx) => {
    const key = format(parseISO(tx.date), 'MMMM yyyy');
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function TransactionsScreen() {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const transactions = usePortfolioStore((s) => s.transactions);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);
  const sections = groupByDate(filtered);

  const totalIn  = filtered.filter((t) => ['deposit', 'dividend', 'sell'].includes(t.type)).reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter((t) => ['withdrawal', 'buy'].includes(t.type)).reduce((s, t) => s + t.amount, 0);

  const s = StyleSheet.create({
    safe:    { flex: 1, backgroundColor: colors.bg },
    header:  { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
    title:   { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
    summaryRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
    summaryCard:{ flex: 1, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md },
    summaryLabel:{ fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 4 },
    summaryValue:{ fontSize: fontSize.md, fontWeight: fontWeight.bold },
    filterRow:   { flexDirection: 'row', gap: spacing.sm },
    filterBtn:   { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1 },
    filterTx:    { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
    sectionHeader:{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.bg },
    sectionTx:   { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
    txCard:      { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
    divider:     { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.md },
    empty:       { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.base, marginTop: spacing.xxl },
  });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={s.header}>
            <Text style={s.title}>Transactions</Text>

            {/* Summary */}
            <View style={s.summaryRow}>
              <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>Money In</Text>
                <Text style={[s.summaryValue, { color: colors.success }]}>{formatCurrency(totalIn)}</Text>
              </View>
              <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>Money Out</Text>
                <Text style={[s.summaryValue, { color: colors.danger }]}>{formatCurrency(totalOut)}</Text>
              </View>
            </View>

            {/* Filters */}
            <View style={s.filterRow}>
              {FILTERS.map(({ label, value }) => {
                const active = filter === value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[s.filterBtn, { backgroundColor: active ? colors.brand : colors.bgTertiary, borderColor: active ? colors.brand : colors.border }]}
                    onPress={() => setFilter(value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.filterTx, { color: active ? '#fff' : colors.textSecondary }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={s.sectionHeader}>
            <Text style={s.sectionTx}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <View style={[s.txCard, index > 0 && { marginTop: 0 }]}>
            <TransactionItem transaction={item} />
            {index < section.data.length - 1 && <View style={s.divider} />}
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No transactions found</Text>}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
      />
    </SafeAreaView>
  );
}
