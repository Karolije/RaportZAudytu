import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface Question {
  id: number;
  text: string;
  answer: string; // tu wpisywanie uwagi
  images: string[];
  tick?: 'yes' | 'no'; // do zaznaczenia tak/nie
}

export default function HomeScreen() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: 'Czy dokumenty są kompletne?', answer: '', images: [] },
    { id: 2, text: 'Czy miejsce pracy jest bezpieczne?', answer: '', images: [] },
    { id: 3, text: 'Czy sprzęt jest sprawny?', answer: '', images: [] },
  ]);

  async function addPhoto(id: number) {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true });
    if (!result.canceled) {
      setQuestions(prev =>
        prev.map(q => (q.id === id ? { ...q, images: [...q.images, result.assets[0].uri] } : q))
      );
    }
  }

  function updateAnswer(id: number, value: string) {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, answer: value } : q)));
  }

  function setTick(id: number, value: 'yes' | 'no') {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, tick: value } : q)));
  }

  return (
    <ScrollView style={styles.container}>
      {questions.map(q => (
        <View key={q.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.text}</Text>

          {/* Tick buttons */}
          <View style={styles.tickContainer}>
            <Button
              title="Tak"
              color={q.tick === 'yes' ? '#4CAF50' : '#ccc'}
              onPress={() => setTick(q.id, 'yes')}
            />
            <Button
              title="Nie"
              color={q.tick === 'no' ? '#F44336' : '#ccc'}
              onPress={() => setTick(q.id, 'no')}
            />
          </View>

          {/* Input dla uwag */}
          <TextInput
            value={q.answer}
            onChangeText={value => updateAnswer(q.id, value)}
            placeholder="Dodaj własną uwagę..."
            style={styles.input}
          />

          {/* Dodawanie zdjęć */}
          <Button title="Dodaj zdjęcie" onPress={() => addPhoto(q.id)} />
          <View style={styles.imagesContainer}>
            {q.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ))}
          </View>
        </View>
      ))}
      <Button title="GENERUJ PDF (dodamy później)" onPress={() => {}} color="#1976D2" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // jasne tło
  },
  questionContainer: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  tickContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
});
