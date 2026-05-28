import { Dimensions, PixelRatio } from 'react-native';

const { width } = Dimensions.get('window');

/** Escala um tamanho de fonte baseado na largura do dispositivo (base: 375px) */
export const scaleFont = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel((width / 375) * size));

/** Formata uma data ISO para exibição em pt-BR */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

/** Trunca um texto longo com reticências */
export const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
