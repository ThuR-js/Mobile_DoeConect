import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useTheme();
  const colorFromProps = props[theme];
  return colorFromProps ?? Colors[theme][colorName];
}
