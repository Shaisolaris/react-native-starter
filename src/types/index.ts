// Asset / Portfolio types
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf' | 'bond';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  logoUrl?: string;
}

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  assets: Asset[];
  history: PortfolioSnapshot[];
}

export interface PortfolioSnapshot {
  date: string;
  value: number;
}

// Transaction types
export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'dividend';

export interface Transaction {
  id: string;
  type: TransactionType;
  symbol?: string;
  assetName?: string;
  quantity?: number;
  price?: number;
  amount: number;
  fee?: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  note?: string;
}

// User/Auth types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  accountNumber: string;
  cashBalance: number;
  kycVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// Market data
export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  type: 'stock' | 'crypto' | 'etf';
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

// Navigation
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'asset-detail': { symbol: string; name: string };
  'transaction-detail': { id: string };
  'add-funds': undefined;
  'send-money': undefined;
};

export type TabParamList = {
  index: undefined;
  portfolio: undefined;
  transactions: undefined;
  market: undefined;
  settings: undefined;
};
