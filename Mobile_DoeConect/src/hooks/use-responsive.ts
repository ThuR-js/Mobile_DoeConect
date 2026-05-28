import { useWindowDimensions, PixelRatio } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const scale = (size: number) =>
    Math.round(PixelRatio.roundToNearestPixel((width / 375) * size));

  return { width, height, scale };
}
