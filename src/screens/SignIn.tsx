import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export function SignIn() {
  const { signIn } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <Text className="text-white text-2xl mb-6">
        Login
      </Text>

      <TouchableOpacity
        className="bg-white px-6 py-3 rounded-lg"
        onPress={signIn}
      >
        <Text className="text-green-600 font-bold">
          Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
