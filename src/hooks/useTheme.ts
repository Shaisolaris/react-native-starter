import { useColorScheme } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../utils/theme';
import type { Colors } from '../utils/theme';

export interface Theme {
  colors:     Colors;
  spacing:    typeof SPACING;
  radius:     typeof RADIUS;
  fontSize:   typeof FONT_SIZE;
  fontWeight: typeof FONT_WEIGHT;
  isDark:     boolean;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    colors:     isDark ? COLORS.dark : COLORS.light,
    spacing:    SPACING,
    radius:     RADIUS,
    fontSize:   FONT_SIZE,
    fontWeight: FONT_WEIGHT,
    isDark,
  };
}
