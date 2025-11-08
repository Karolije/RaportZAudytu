import AuditForm from '@/components/audit-form';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuditForm />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // albo dopasuj do motywu
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center', // wycentruje formularz jeśli ekran większy
  },
});
