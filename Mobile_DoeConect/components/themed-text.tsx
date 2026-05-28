import { StyleSheet, Text, type TextProps, Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');
const scale = (size: number) => Math.round(PixelRatio.roundToNearestPixel(width / 375 * size));

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: scale(16),
    lineHeight: scale(24),
  },
  defaultSemiBold: {
    fontSize: scale(16),
    lineHeight: scale(24),
    fontWeight: '600',
  },
  title: {
    fontSize: scale(32),
    fontWeight: 'bold',
    lineHeight: scale(32),
  },
  subtitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: scale(30),
    fontSize: scale(16),
    color: '#0a7ea4',
  },
});
