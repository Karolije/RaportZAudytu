import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Question {
  id: number;
  text: string;
  answer: boolean | null; // Tak/Nie/null
  note: string;
  images: string[]; // base64
}

export default function AuditChecklist() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: 'Czy dokumentacja jest kompletna?', answer: null, note: '', images: [] },
    { id: 2, text: 'Czy sprzęt działa prawidłowo?', answer: null, note: '', images: [] },
    { id: 3, text: 'Czy miejsce pracy jest czyste?', answer: null, note: '', images: [] },
  ]);

  // Dodawanie zdjęcia w formacie base64
  async function addPhoto(id: number) {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setQuestions(prev =>
        prev.map(q => (q.id === id ? { ...q, images: [...q.images, base64] } : q))
      );
    }
  }

  function setAnswer(id: number, value: boolean) {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, answer: value } : q))
    );
  }

  function updateNote(id: number, text: string) {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, note: text } : q))
    );
  }

  // Poprawione zapisywanie do Supabase
  async function saveToSupabase() {
    try {
      const payload = questions.map(q => ({
        question_text: q.text,
        answer: q.answer,
        note: q.note,
        images: q.images, // jeśli masz kolumnę typu text[] lub jsonb w Supabase
      }));

      const { data, error } = await supabase.from('pytania').insert(payload);

      if (error) {
        console.log('Błąd zapisu:', error);
        Alert.alert('Błąd', 'Nie udało się zapisać do Supabase: ' + error.message);
      } else {
        console.log('Zapisano:', data);
        Alert.alert('Sukces', 'Zapisano do Supabase!');
      }
    } catch (err) {
      console.log('Exception:', err);
      Alert.alert('Błąd', 'Wystąpił nieoczekiwany błąd.');
    }
  }

  // Generowanie PDF
  async function generatePDF() {
    let html = '<h1>Raport Audytu</h1>';
    questions.forEach(q => {
      html += `<h3>${q.text}</h3>`;
      html += `<p>Odpowiedź: ${q.answer === true ? 'Tak' : q.answer === false ? 'Nie' : 'Brak odpowiedzi'}</p>`;
      if (q.note) html += `<p>Uwagi: ${q.note}</p>`;
      if (q.images.length > 0) {
        q.images.forEach(base64 => {
          html += `<img src="${base64}" width="200" style="margin:5px 0;" />`;
        });
      }
      html += '<hr />';
    });

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  return (
    <ScrollView style={styles.container}>
      {questions.map(q => (
        <View key={q.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.text}</Text>

          <View style={styles.checkboxRow}>
            <Pressable style={styles.checkboxContainer} onPress={() => setAnswer(q.id, true)}>
              <View style={[styles.checkbox, q.answer === true && styles.checked]} />
              <Text style={styles.checkboxLabel}>Tak</Text>
            </Pressable>

            <Pressable style={styles.checkboxContainer} onPress={() => setAnswer(q.id, false)}>
              <View style={[styles.checkbox, q.answer === false && styles.checked]} />
              <Text style={styles.checkboxLabel}>Nie</Text>
            </Pressable>
          </View>

          <TextInput
            placeholder="Wpisz własną uwagę..."
            value={q.note}
            onChangeText={text => updateNote(q.id, text)}
            style={styles.input}
            multiline
          />

          <Button title="Dodaj zdjęcie" onPress={() => addPhoto(q.id)} />

          <View style={styles.imagesRow}>
            {q.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ))}
          </View>
        </View>
      ))}

      <Button title="GENERUJ PDF" onPress={generatePDF} />
      <Button title="Zapisz do Supabase" onPress={saveToSupabase} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  questionContainer: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  questionText: { fontSize: 18, marginBottom: 8 },
  checkboxRow: { flexDirection: 'row', gap: 20, marginBottom: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkbox: { width: 24, height: 24, borderWidth: 1, borderColor: '#333', borderRadius: 4 },
  checked: { backgroundColor: '#333' },
  checkboxLabel: { fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 8 },
  imagesRow: { flexDirection: 'row', marginTop: 10 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
});

async function testSupabase() {
  const { data, error } = await supabase.from('pytania').select('*').limit(1)
  console.log('Test Supabase:', data, error)
}
testSupabase()