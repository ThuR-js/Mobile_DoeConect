import { Text, type TextProps, PixelRatio, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const scale = (size: number) =>
    Math.round(PixelRatio.roundToNearestPixel((width / 375) * size));

  return (
    <Text
      style={[
        { color },
        type === 'default' && { fontSize: scale(16), lineHeight: scale(24) },
        type === 'title' && { fontSize: scale(32), fontWeight: 'bold', lineHeight: scale(32) },
        type === 'defaultSemiBold' && { fontSize: scale(16), lineHeight: scale(24), fontWeight: '600' },
        type === 'subtitle' && { fontSize: scale(20), fontWeight: 'bold' },
        type === 'link' && { lineHeight: scale(30), fontSize: scale(16), color: '#0a7ea4' },
        style,
      ]}
      {...rest}
    />
  );
}
