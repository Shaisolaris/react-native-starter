import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Transaction, TransactionType } from '../../types';

const typeConfig: Record<TransactionType, { label: string; icon: string; colorKey: 'success' | 'danger' | 'brand' | 'warning' }> = {
  buy:        { label: 'Buy',        icon: '↑', colorKey: 'success' },
  sell:       { label: 'Sell',       icon: '↓', colorKey: 'danger'  },
  deposit:    { label: 'Deposit',    icon: '+', colorKey: 'brand'   },
  withdrawal: { label: 'Withdrawal', icon: '−', colorKey: 'warning' },
  dividend:   { label: 'Dividend',   icon: '★', colorKey: 'success' },
};

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: (tx: Transaction) => void;
}

function TransactionItemComponent({ transaction, onPress }: TransactionItemProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const cfg     = typeConfig[transaction.type];
  const color   = colors[cfg.colorKey];
  const bgColor = `${color}20`;

  const isPositive = ['deposit', 'dividend', 'sell'].includes(transaction.type);

  const styles = StyleSheet.create({
    container: {
      flexDirection:  'row',
      alignItems:     'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    iconWrap: {
      width:          40,
      height:         40,
      borderRadius:   radius.md,
      backgroundColor: bgColor,
      alignItems:     'center',
      justifyContent: 'center',
      marginRight:    spacing.md,
    },
    icon: {
      fontSize:   fontSize.lg,
      color,
      fontWeight: fontWeight.bold,
    },
    info:    { flex: 1 },
    topRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    label:   { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: colors.text },
    amount:  {
      fontSize:   fontSize.base,
      fontWeight: fontWeight.bold,
      color:      isPositive ? colors.success : colors.danger,
    },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detail:    { fontSize: fontSize.sm, color: colors.textSecondary },
    date:      { fontSize: fontSize.sm, color: colors.textMuted },
    statusDot: {
      width:  6, height: 6,
      borderRadius: 3,
      backgroundColor: transaction.status === 'completed' ? colors.success : transaction.status === 'pending' ? colors.warning : colors.danger,
      alignSelf: 'center',
      marginLeft: spacing.xs,
    },
  });

  const detailText = transaction.symbol
    ? `${transaction.symbol}${transaction.quantity ? ` · ${transaction.quantity} shares` : ''}`
    : transaction.note ?? cfg.label;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress?.(transaction)} style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{cfg.icon}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.label}>{cfg.label}{transaction.assetName ? ` ${transaction.assetName}` : ''}</Text>
          <Text style={styles.amount}>
            {isPositive ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.detail} numberOfLines={1}>{detailText}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.date}>{formatDate(transaction.date, 'MMM d, yyyy')}</Text>
            <View style={styles.statusDot} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const TransactionItem = memo(TransactionItemComponent);
