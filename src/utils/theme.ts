import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SCREEN = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };

export const SPACING = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
} as const;

export const RADIUS = {
  sm:   6,
  md:   12,
  lg:   16,
  xl:   24,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   16,
  lg:   18,
  xl:   22,
  xxl:  28,
  hero:  36,
} as const;

export const FONT_WEIGHT = {
  regular:   '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extrabold: '800',
} as const;

const lightColors = {
  // Backgrounds
  bg:           '#FFFFFF',
  bgSecondary:  '#F8F9FA',
  bgTertiary:   '#F1F3F5',
  card:         '#FFFFFF',
  cardBorder:   '#E9ECEF',

  // Text
  text:         '#1A1D23',
  textSecondary:'#6B7280',
  textMuted:    '#9CA3AF',
  textInverse:  '#FFFFFF',

  // Brand
  brand:        '#4F6EF7',
  brandLight:   '#EEF2FF',
  brandDark:    '#3B5BDB',

  // Semantic
  success:      '#10B981',
  successLight: '#D1FAE5',
  danger:       '#EF4444',
  dangerLight:  '#FEE2E2',
  warning:      '#F59E0B',
  warningLight: '#FEF3C7',
  info:         '#3B82F6',
  infoLight:    '#DBEAFE',

  // UI
  border:       '#E5E7EB',
  divider:      '#F3F4F6',
  shadow:       '#000000',
  overlay:      'rgba(0,0,0,0.5)',
  tabBar:       '#FFFFFF',
  tabBarBorder: '#E5E7EB',

  // Chart colors
  chartPrimary: '#4F6EF7',
  chartUp:      '#10B981',
  chartDown:    '#EF4444',
};

const darkColors: typeof lightColors = {
  bg:           '#0A0A0F',
  bgSecondary:  '#111118',
  bgTertiary:   '#1A1A27',
  card:         '#13131E',
  cardBorder:   '#1E1E2E',

  text:         '#F1F3F5',
  textSecondary:'#9CA3AF',
  textMuted:    '#6B7280',
  textInverse:  '#0A0A0F',

  brand:        '#6B8EFF',
  brandLight:   '#1E2547',
  brandDark:    '#5070E0',

  success:      '#34D399',
  successLight: '#064E3B',
  danger:       '#F87171',
  dangerLight:  '#7F1D1D',
  warning:      '#FBBF24',
  warningLight: '#78350F',
  info:         '#60A5FA',
  infoLight:    '#1E3A5F',

  border:       '#1E1E2E',
  divider:      '#1A1A27',
  shadow:       '#000000',
  overlay:      'rgba(0,0,0,0.7)',
  tabBar:       '#0D0D18',
  tabBarBorder: '#1E1E2E',

  chartPrimary: '#6B8EFF',
  chartUp:      '#34D399',
  chartDown:    '#F87171',
};

export const COLORS = {
  light: lightColors,
  dark:  darkColors,
};

export type ColorScheme = 'light' | 'dark';
export type Colors = typeof lightColors;
