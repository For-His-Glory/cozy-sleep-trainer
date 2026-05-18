import { View, Text } from "react-native";

export default function App() {
  console.log("App is rendering");

  return (
    <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Hello Caden!
      </Text>
    </View>
  );
}