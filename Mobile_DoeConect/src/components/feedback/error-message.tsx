import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';

type Props = {
  mensagem: string;
  onRetry?: () => void;
};

export function ErrorMessage({ mensagem, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>⚠️ {mensagem}</ThemedText>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <ThemedText style={styles.buttonText}>Tentar novamente</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  text: { fontSize: 15, textAlign: 'center', opacity: 0.8 },
  button: {
    backgroundColor: '#5C3317',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
