import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, Image, Text, TextInput, View } from "react-native";

export default function FormScreen() {
  const [answer, setAnswer] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  async function addPhoto() {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Pytanie 1: Opisz sytuację</Text>
      <TextInput
        value={answer}
        onChangeText={setAnswer}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Zrób zdjęcie" onPress={addPhoto} />

      {photos.map((uri, index) => (
        <Image key={index} source={{ uri }} style={{ width: 100, height: 100, marginTop: 10 }} />
      ))}
    </View>
  );
}
