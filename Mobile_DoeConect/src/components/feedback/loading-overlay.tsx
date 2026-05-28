import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';

type Props = { mensagem?: string };

export function LoadingOverlay({ mensagem = 'Carregando...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5C3317" />
      <ThemedText style={styles.text}>{mensagem}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  text: { fontSize: 14, opacity: 0.7 },
});
