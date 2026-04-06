export function formatCurrency(amount: number): string { return "$" + amount.toFixed(2); }
export function formatDate(date: string): string { return new Date(date).toLocaleDateString(); }
export function formatNumber(n: number): string { return n.toLocaleString(); }

export function formatPercent(n: number): string { return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; }
export function formatShares(n: number): string { return n.toFixed(4); }
