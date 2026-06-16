import Svg, { Path, Line } from 'react-native-svg';

const SW = 1.6;
type Props = { size?: number; color?: string };

export function IconCamiseta({ size = 24, color = '#8B4A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7 L7 4 Q9 3 9 5.5 Q9 7.5 12 7.5 Q15 7.5 15 5.5 Q15 3 17 4 L21 7 L18 10 L18 20 L6 20 L6 10 Z"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconCalca({ size = 24, color = '#8B4A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* cós */}
      <Path d="M5 3 L19 3 L19 6 L5 6 Z"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* perna esquerda */}
      <Path d="M5 6 L7 21 L12 21 L12 13"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* perna direita */}
      <Path d="M19 6 L17 21 L12 21 L12 13"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconBlusa({ size = 24, color = '#8B4A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* corpo */}
      <Path d="M7 21 L7 10 L17 10 L17 21 Z"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* ombro esquerdo + manga longa */}
      <Path d="M7 10 L4 8 L2 8 L2 14 L7 14"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* ombro direito + manga longa */}
      <Path d="M17 10 L20 8 L22 8 L22 14 L17 14"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* gola com colarinho */}
      <Path d="M7 10 L9 8 L12 10 L15 8 L17 10"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* abotoamento central */}
      <Line x1="12" y1="10" x2="12" y2="21" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      {/* botões */}
      <Line x1="12" y1="13" x2="12" y2="13.5" stroke={color} strokeWidth={SW * 1.8} strokeLinecap="round" />
      <Line x1="12" y1="16" x2="12" y2="16.5" stroke={color} strokeWidth={SW * 1.8} strokeLinecap="round" />
      <Line x1="12" y1="19" x2="12" y2="19.5" stroke={color} strokeWidth={SW * 1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function IconShort({ size = 24, color = '#8B4A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* cós */}
      <Path d="M5 3 L19 3 L19 6 L5 6 Z"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* perna esquerda curta */}
      <Path d="M5 6 L6 15 L12 15 L12 11"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
      {/* perna direita curta */}
      <Path d="M19 6 L18 15 L12 15 L12 11"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconTenis({ size = 24, color = '#8B4A1E' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* pé esquerdo */}
      <Path d="M4 13 Q3 10 5 8 Q7 6 9 8 Q10 10 9 13 Q8 15 6 15 Q4 15 4 13 Z"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* dedos pé esquerdo */}
      <Path d="M6 8 Q5.5 6 6 5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <Path d="M7.5 7.5 Q7.5 5.5 8 4.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <Path d="M9 8 Q9.5 6.5 9.5 5.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      {/* pé direito (deslocado) */}
      <Path d="M13 19 Q12 16 14 14 Q16 12 18 14 Q19 16 18 19 Q17 21 15 21 Q13 21 13 19 Z"
        stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"
      />
      {/* dedos pé direito */}
      <Path d="M15 14 Q14.5 12 15 11" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <Path d="M16.5 13.5 Q16.5 11.5 17 10.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
      <Path d="M18 14 Q18.5 12.5 18.5 11.5" stroke={color} strokeWidth={SW} strokeLinecap="round" />
    </Svg>
  );
}
