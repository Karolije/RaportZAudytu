import { Button, Text, View } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Raport z audytu</Text>
      <Button title="Wypełnij formularz" onPress={() => navigation.navigate("Form")} />
    </View>
  );
}
