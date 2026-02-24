import { View, Text, TouchableOpacity, SectionList } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { PercentageCard } from "@/src/components/PercentageCard";
import { Header } from "@/src/components/Header";
import { MealItem } from "../components/MealItem";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "../routes/app.routes";
import { useQuery } from "@tanstack/react-query";
import {  getMealsRequest } from "../services/meals";
import { groupMealsByDate } from "../utils/groupMealsByDate";
import { SafeAreaView } from "react-native-safe-area-context";

export function Home() {
  const { signOut } = useAuth();

  const navigation = useNavigation<AppNavigationProps>()

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

      {/* Percentage */}
      <PercentageCard />

      {/* Button */}
      <Text className="text-gray-600 mb-2">
        Refeições
      </Text>

      <Button title="Nova Refeição" iconName="add" onPress={() => navigation.navigate("MealForm")}/>

      {/* List */}
      <SectionList
        sections={meals}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <MealItem id={item.id} title={item.name} time={item.date} isOnDiet={item.isOnDiet}/>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Header title={title}/>
        )}
        ListEmptyComponent={() => (
          <View className="mt-20">
            <Text className="text-center text-gray-3 font-nunito_regular">Nenhum item na lista, Adicione uma refeição!</Text>
          </View>
        )}
        contentContainerStyle={{marginTop: 6, paddingBottom: 0}}
        style={{marginBottom: 20}}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
