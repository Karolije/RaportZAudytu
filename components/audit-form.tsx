import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

// Tutaj w przyszłości podłączymy bibliotekę PDF
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Question = {
  id: number;
  text: string;
  images: string[];
  answer: string;
};

const QUESTIONS: Question[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  text: `Pytanie ${i + 1}`,
  images: [],
  answer: '',
}));

export default function AuditForm() {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);

  const pickImage = async (questionId: number) => {
    if (!(await ImagePicker.requestMediaLibraryPermissionsAsync()).granted) {
      Alert.alert('Brak dostępu', 'Nie masz uprawnień do galerii zdjęć.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setQuestions(prev =>
        prev.map(q =>
          q.id === questionId
            ? {
                ...q,
                images: q.images.length < 3 ? [...q.images, result.assets[0].uri] : q.images,
              }
            : q
        )
      );
    }
  };

  const generatePDF = () => {
    Alert.alert('PDF', 'Tutaj wygenerujemy PDF z odpowiedziami i zdjęciami.');
    // Później tutaj wywołamy funkcję do tworzenia PDF
  };

  return (
    <ScrollView style={styles.container}>
      {questions.map(q => (
        <View key={q.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.text}</Text>
          <Button title="Dodaj zdjęcie" onPress={() => pickImage(q.id)} />
          <View style={styles.imagesContainer}>
            {q.images.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.image} />
            ))}
          </View>
        </View>
      ))}
      <Button title="Generuj PDF" onPress={generatePDF} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  questionContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});
