export interface Asset { id: string; name: string; symbol: string; price: number; change: number; }
export interface Transaction { id: string; type: "send" | "receive"; amount: number; date: string; description: string; }
export interface User { id: string; name: string; email: string; avatar?: string; }

export type TransactionType = 'send' | 'receive' | 'swap' | 'stake';
