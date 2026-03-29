import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency, formatPercent, formatShares } from '../utils/format';
import type { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  onPress?: (asset: Asset) => void;
  showHoldings?: boolean;
  style?: ViewStyle;
}

function AssetCardComponent({
  asset,
  onPress,
  showHoldings = true,
  style,
}: AssetCardProps) {
  const { colors, spacing, radius, fontSize, fontWeight } = useTheme();
  const isPositive = asset.changePercent24h >= 0;

  const totalValue = asset.currentPrice * asset.quantity;
  const totalGain  = (asset.currentPrice - asset.averageCost) * asset.quantity;
  const gainPct    = ((asset.currentPrice - asset.averageCost) / asset.averageCost) * 100;

  const changeColor = isPositive ? colors.success : colors.danger;
  const changeBg    = isPositive ? colors.successLight : colors.dangerLight;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius:    radius.lg,
      borderWidth:     1,
      borderColor:     colors.cardBorder,
      padding:         spacing.md,
      flexDirection:   'row',
      alignItems:      'center',
    },
    logo: {
      width:           44,
      height:          44,
      borderRadius:    radius.md,
      backgroundColor: colors.bgTertiary,
      alignItems:      'center',
      justifyContent:  'center',
      marginRight:     spacing.md,
    },
    logoText: {
      fontSize:   fontSize.sm,
      fontWeight: fontWeight.bold,
      color:      colors.text,
    },
    assetType: {
      fontSize:   9,
      fontWeight: fontWeight.semibold,
      color:      colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop:  1,
    },
    info: { flex: 1 },
    nameRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   2,
    },
    name: {
      fontSize:   fontSize.base,
      fontWeight: fontWeight.semibold,
      color:      colors.text,
      flex: 1,
      marginRight: spacing.sm,
    },
    price: {
      fontSize:   fontSize.base,
      fontWeight: fontWeight.bold,
      color:      colors.text,
    },
    detailRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    symbol: {
      fontSize: fontSize.sm,
      color:    colors.textSecondary,
      fontWeight: fontWeight.medium,
    },
    holdings: {
      fontSize: fontSize.sm,
      color:    colors.textSecondary,
    },
    changeBadge: {
      flexDirection:  'row',
      alignItems:     'center',
      backgroundColor: changeBg,
      borderRadius:   radius.sm,
      paddingHorizontal: 6,
      paddingVertical:   2,
    },
    changeText: {
      fontSize:   fontSize.xs,
      fontWeight: fontWeight.semibold,
      color:      changeColor,
    },
    gainRow: {
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginTop:      4,
    },
    gainText: {
      fontSize:   fontSize.xs,
      color:      totalGain >= 0 ? colors.success : colors.danger,
      fontWeight: fontWeight.medium,
    },
    totalValue: {
      fontSize:   fontSize.sm,
      fontWeight: fontWeight.semibold,
      color:      colors.text,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(asset)}
      style={[styles.container, style]}
    >
      {/* Symbol logo placeholder */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>{asset.symbol.slice(0, 2)}</Text>
        <Text style={styles.assetType}>{asset.type}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{asset.name}</Text>
          <Text style={styles.price}>{formatCurrency(asset.currentPrice)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.symbol}>{asset.symbol}</Text>
          <View style={styles.changeBadge}>
            <Text style={styles.changeText}>
              {isPositive ? '▲' : '▼'} {formatPercent(Math.abs(asset.changePercent24h), false)}
            </Text>
          </View>
        </View>

        {showHoldings && (
          <View style={styles.gainRow}>
            <Text style={styles.gainText}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)} ({formatPercent(gainPct)})
            </Text>
            <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export const AssetCard = memo(AssetCardComponent);
