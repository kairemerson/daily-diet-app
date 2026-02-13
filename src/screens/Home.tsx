import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export function Home() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl font-bold mb-4">
        Daily Diet Home
      </Text>

      <TouchableOpacity
        className="bg-red-500 px-4 py-2 rounded-lg"
        onPress={signOut}
      >
        <Text className="text-white">
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}
