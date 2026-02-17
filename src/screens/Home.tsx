import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { PercentageCard } from "@/src/components/PercentageCard";
import { Header } from "@/src/components/Header";
import { MealItem } from "../components/MealItem";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "../routes/app.routes";


export function Home() {
  const { signOut } = useAuth();

  const navigation = useNavigation<AppNavigationProps>()

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-14">
      
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-xl font-bold">
          Daily Diet
        </Text>

        <View className="w-10 h-10 rounded-full bg-gray-300" />
      </View>

      {/* Percentage */}
      <PercentageCard percentage={90} />

      {/* Button */}
      <Text className="text-gray-600 mb-2">
        Refeições
      </Text>

      <Button title="Nova Refeição" iconName="add" onPress={() => navigation.navigate("MealForm", {id: "123"})}/>

      {/* List */}
      <Header title="12.08.22" />

      <MealItem time="20:00" title="X-tudo" isOnDiet={false} />
      <MealItem time="16:00" title="Whey protein com leite" isOnDiet />
      <MealItem time="12:30" title="Salada cesar com frango" isOnDiet />
      <MealItem time="09:30" title="Vitamina de banana com..." isOnDiet />

      <Header title="11.08.22" />

      <MealItem time="20:00" title="X-tudo" isOnDiet={false} />
      <MealItem time="16:00" title="Whey protein com leite" isOnDiet />
    </ScrollView>
  );
}
