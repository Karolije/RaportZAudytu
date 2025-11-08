import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, ScrollView, Text, TextInput, View } from 'react-native';

interface Question {
  id: number;
  text: string;
  answer: string;
  images: string[];
}

export default function HomeScreen() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: 'Pytanie 1', answer: '', images: [] },
    { id: 2, text: 'Pytanie 2', answer: '', images: [] },
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

  return (
    <ScrollView style={{ padding: 20 }}>
      {questions.map(q => (
        <View key={q.id} style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 18, marginBottom: 6 }}>{q.text}</Text>
          <TextInput
            value={q.answer}
            onChangeText={value => updateAnswer(q.id, value)}
            placeholder="Wpisz odpowiedź"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }}
          />
          <Button title="Zrób zdjęcie" onPress={() => addPhoto(q.id)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {q.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={{ width: 80, height: 80, marginRight: 10, borderRadius: 8 }} />
            ))}
          </View>
        </View>
      ))}
      <Button title="GENERUJ PDF (dodamy później)" onPress={() => {}} />
    </ScrollView>
  );
}
