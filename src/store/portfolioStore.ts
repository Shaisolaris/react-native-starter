import { create } from 'zustand';
import type { Portfolio, Asset, Transaction, WatchlistItem } from '../types';

function generateHistory(days: number, baseValue: number): { date: string; value: number }[] {
  const history: { date: string; value: number }[] = [];
  let value = baseValue * 0.75;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = value * (1 + (Math.random() - 0.45) * 0.03);
    history.push({ date: date.toISOString().slice(0, 10), value: Math.round(value * 100) / 100 });
  }
  return history;
}

const MOCK_ASSETS: Asset[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.',       type: 'stock',  quantity: 15.5,  averageCost: 145.00, currentPrice: 189.84, change24h: 2.14,  changePercent24h:  1.14 },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.',  type: 'stock',  quantity: 8.0,   averageCost: 290.00, currentPrice: 414.67, change24h: -3.22, changePercent24h: -0.77 },
  { id: '3', symbol: 'BTC',  name: 'Bitcoin',          type: 'crypto', quantity: 0.4821, averageCost: 38000, currentPrice: 68420,  change24h: 1280,  changePercent24h:  1.91 },
  { id: '4', symbol: 'ETH',  name: 'Ethereum',         type: 'crypto', quantity: 2.15,  averageCost: 1800,  currentPrice: 3680,   change24h: -45.2, changePercent24h: -1.21 },
  { id: '5', symbol: 'VOO',  name: 'Vanguard S&P 500', type: 'etf',    quantity: 12.0,  averageCost: 380.00, currentPrice: 491.52, change24h: 1.87,  changePercent24h:  0.38 },
  { id: '6', symbol: 'TSLA', name: 'Tesla Inc.',       type: 'stock',  quantity: 20.0,  averageCost: 220.00, currentPrice: 177.48, change24h: -4.32, changePercent24h: -2.37 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'buy',        symbol: 'AAPL', assetName: 'Apple Inc.',   quantity: 5,    price: 187.44, amount: 937.20,  fee: 0,    date: new Date(Date.now() - 86400000).toISOString(),      status: 'completed' },
  { id: 't2', type: 'sell',       symbol: 'TSLA', assetName: 'Tesla Inc.',   quantity: 3,    price: 182.00, amount: 546.00,  fee: 0,    date: new Date(Date.now() - 2*86400000).toISOString(),    status: 'completed' },
  { id: 't3', type: 'buy',        symbol: 'BTC',  assetName: 'Bitcoin',      quantity: 0.05, price: 67800,  amount: 3390.00, fee: 8.50, date: new Date(Date.now() - 4*86400000).toISOString(),    status: 'completed' },
  { id: 't4', type: 'deposit',                                                                               amount: 5000.00, fee: 0,    date: new Date(Date.now() - 6*86400000).toISOString(),    status: 'completed', note: 'Bank transfer' },
  { id: 't5', type: 'dividend',   symbol: 'VOO',  assetName: 'Vanguard ETF',                                amount: 124.32,  fee: 0,    date: new Date(Date.now() - 9*86400000).toISOString(),    status: 'completed', note: 'Q2 dividend' },
  { id: 't6', type: 'buy',        symbol: 'ETH',  assetName: 'Ethereum',     quantity: 0.5,  price: 3620,   amount: 1810.00, fee: 4.50, date: new Date(Date.now() - 12*86400000).toISOString(),   status: 'completed' },
  { id: 't7', type: 'withdrawal',                                                                            amount: 2000.00, fee: 0,    date: new Date(Date.now() - 15*86400000).toISOString(),   status: 'completed', note: 'To bank account' },
  { id: 't8', type: 'buy',        symbol: 'MSFT', assetName: 'Microsoft',    quantity: 2,    price: 405.00, amount: 810.00,  fee: 0,    date: new Date(Date.now() - 20*86400000).toISOString(),   status: 'completed' },
];

const MOCK_WATCHLIST: WatchlistItem[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.',     price: 878.36, changePercent:  3.24 },
  { symbol: 'AMZN', name: 'Amazon.com',       price: 184.70, changePercent:  0.85 },
  { symbol: 'SOL',  name: 'Solana',           price: 148.22, changePercent: -2.14 },
  { symbol: 'META', name: 'Meta Platforms',   price: 474.04, changePercent:  1.08 },
  { symbol: 'SPY',  name: 'SPDR S&P 500 ETF', price: 524.30, changePercent:  0.42 },
];

function calcPortfolio(assets: Asset[]): Omit<Portfolio, 'history' | 'assets'> {
  const totalValue    = assets.reduce((s, a) => s + a.currentPrice * a.quantity, 0);
  const totalCost     = assets.reduce((s, a) => s + a.averageCost * a.quantity, 0);
  const totalGain     = totalValue - totalCost;
  const totalGainPct  = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const dayChange     = assets.reduce((s, a) => s + a.change24h * a.quantity, 0);
  const dayChangePct  = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;
  return { totalValue, totalCost, totalGain, totalGainPercent: totalGainPct, dayChange, dayChangePercent: dayChangePct };
}

interface PortfolioStore {
  portfolio:   Portfolio | null;
  transactions: Transaction[];
  watchlist:   WatchlistItem[];
  isLoading:   boolean;
  selectedPeriod: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  loadPortfolio: () => void;
  setPeriod: (period: PortfolioStore['selectedPeriod']) => void;
  refreshPrices: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolio:        null,
  transactions:     MOCK_TRANSACTIONS,
  watchlist:        MOCK_WATCHLIST,
  isLoading:        false,
  selectedPeriod:   '1M',

  loadPortfolio: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      const summary = calcPortfolio(MOCK_ASSETS);
      set({
        portfolio: {
          ...summary,
          assets:  MOCK_ASSETS,
          history: generateHistory(90, summary.totalValue),
        },
        isLoading: false,
      });
    }, 600);
  },

  setPeriod: (selectedPeriod) => {
    set({ selectedPeriod });
    const days = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': 730 }[selectedPeriod];
    const { portfolio } = get();
    if (portfolio) {
      set({
        portfolio: {
          ...portfolio,
          history: generateHistory(days, portfolio.totalValue),
        },
      });
    }
  },

  refreshPrices: () => {
    // Simulate small price movements
    const updated = MOCK_ASSETS.map((a) => ({
      ...a,
      currentPrice: a.currentPrice * (1 + (Math.random() - 0.5) * 0.005),
    }));
    const summary = calcPortfolio(updated);
    const { portfolio } = get();
    if (portfolio) {
      set({
        portfolio: {
          ...portfolio,
          ...summary,
          assets: updated,
        },
      });
    }
  },
}));
