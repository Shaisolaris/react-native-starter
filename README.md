# React Native Fintech App


## Quick Start

```bash
git clone https://github.com/Shaisolaris/react-native-starter.git
cd react-native-starter
npm install --legacy-peer-deps
npx expo start
```

Production-grade fintech mobile application built with **React Native**, **Expo**, and **TypeScript**. Portfolio tracking, real-time price simulation, transaction history, biometric authentication, and full dark mode — structured as a real client deliverable.

## Features

### Authentication
- Email + password login with form validation
- **Biometric auth** — Face ID (iOS) / Fingerprint (Android) via `expo-local-authentication`
- Show/hide password toggle
- Secure token storage via `expo-secure-store`
- Haptic feedback on auth success/failure

### Dashboard (Home Screen)
- Masked account number display
- Cash balance with real-time day change
- Quick action bar — Add Funds, Send, Buy, History
- Portfolio summary card with period selector (1D / 1W / 1M / 3M / 1Y / ALL)
- Pull-to-refresh with 30-second auto price refresh
- Top 4 holdings preview
- Recent 5 transactions

### Portfolio
- Full holdings list with `AssetCard` component
- Per-asset: current price, 24h change badge, total value, gain/loss with percentage
- Supports stocks, crypto, ETFs, bonds
- Asset type labels

### Transactions
- Grouped by month with `SectionList`
- Filter by type: All / Buys / Sells / Deposits / Withdrawals
- Money In / Money Out summary
- Status indicators (completed / pending / failed)
- Transaction detail with fee display

### Settings
- Profile & KYC, Security, Notifications, Payment Methods, Tax Documents, Linked Accounts
- Sign out with Zustand store clear

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React Native 0.74 + Expo 51 |
| Navigation | Expo Router (file-based, like Next.js) |
| State | Zustand (auth store + portfolio store) |
| Data fetching | TanStack Query (wired, ready for API) |
| Charts | Victory Native + Skia |
| Animations | Reanimated 3 |
| Biometrics | expo-local-authentication |
| Storage | expo-secure-store + react-native-mmkv |
| Date utils | date-fns |
| Haptics | expo-haptics |

## Project Structure

```
app/
├── index.tsx                       # Login screen (root)
└── (tabs)/
    ├── _layout.tsx                 # Tab bar configuration
    ├── index.tsx                   # Home/Dashboard
    ├── portfolio.tsx               # Portfolio
    ├── transactions.tsx            # Activity / Transactions
    └── settings.tsx                # Settings
src/
├── screens/
│   ├── auth/LoginScreen.tsx        # Biometric + password login
│   ├── dashboard/HomeScreen.tsx    # Main dashboard
│   └── transactions/TransactionsScreen.tsx
├── components/
│   └── ui/
│       ├── AssetCard.tsx           # Holdings card with gain/loss
│       └── TransactionItem.tsx     # Transaction row with status
├── store/
│   ├── authStore.ts               # Zustand auth state
│   └── portfolioStore.ts          # Portfolio + mock price simulation
├── hooks/
│   ├── useTheme.ts                 # Light/dark theme access
│   └── useBiometrics.ts           # Face ID / Touch ID wrapper
├── utils/
│   ├── theme.ts                    # Design tokens (colors, spacing, radius)
│   └── format.ts                  # Currency, percent, date formatters
└── types/
    └── index.ts                    # TypeScript interfaces
```

## Design System

Defined in `src/utils/theme.ts`:
- Full light/dark color palette (15+ semantic tokens)
- Spacing scale (xs → xxl)
- Border radius scale
- Font size scale (xs → hero)
- Font weight constants

All components consume theme via `useTheme()` hook — no hardcoded colors anywhere.

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

## Connect to a Real API

Replace the mock data in `src/store/portfolioStore.ts` with real API calls using TanStack Query:

```typescript
// Example
const { data: portfolio } = useQuery({
  queryKey: ['portfolio'],
  queryFn: () => api.get('/portfolio').then(r => r.data),
  refetchInterval: 30_000,
});
```

The type interfaces in `src/types/index.ts` are ready to wire to any fintech API.

## Requirements

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android emulator, or physical device with Expo Go
