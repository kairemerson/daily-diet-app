import { View, Text, TouchableOpacity, SectionList } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {  getMealsRequest } from "../services/meals";
import { groupMealsByDate } from "../utils/groupMealsByDate";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminStackParamList } from "../@types/navigation";

export function HomeAdmin() {
  const { signOut } = useAuth();

  const navigation = useNavigation<AdminStackParamList>()

  const {data: meals = [], isLoading} = useQuery({
    queryKey: ["meals"],
    queryFn: getMealsRequest,
    select: (data) => groupMealsByDate(data)
  })
    
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 mt-4">
        <Text className="text-xl font-bold">
          Daily Diet
        </Text>

        <TouchableOpacity onPress={() => signOut()} >
          <View className="w-10 h-10 rounded-full bg-gray-300" />

        </TouchableOpacity>
      </View>

    
    </SafeAreaView>
  );
}
