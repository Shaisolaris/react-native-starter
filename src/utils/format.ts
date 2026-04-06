export function formatCurrency(amount: number): string { return "$" + amount.toFixed(2); }
export function formatDate(date: string): string { return new Date(date).toLocaleDateString(); }
export function formatNumber(n: number): string { return n.toLocaleString(); }
