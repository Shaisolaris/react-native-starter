import { format, parseISO, formatDistanceToNow } from 'date-fns';

export function formatCurrency(
  amount: number,
  currency = 'USD',
  compact = false
): string {
  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000)
      return `$${(amount / 1_000_000_000).toFixed(2)}B`;
    if (Math.abs(amount) >= 1_000_000)
      return `$${(amount / 1_000_000).toFixed(2)}M`;
    if (Math.abs(amount) >= 1_000)
      return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number, includeSign = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatShares(quantity: number): string {
  if (quantity >= 1000) return quantity.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return quantity.toFixed(quantity < 1 ? 6 : 4);
}

export function formatDate(dateString: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), fmt);
  } catch {
    return dateString;
  }
}

export function formatRelative(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function isPositive(value: number): boolean {
  return value >= 0;
}

export function maskAccountNumber(account: string): string {
  return '•••• ' + account.slice(-4);
}
