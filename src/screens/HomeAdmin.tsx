import { View, Text, TouchableOpacity, SectionList, FlatList } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {  getMealsRequest } from "../services/meals";
import { groupMealsByDate } from "../utils/groupMealsByDate";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminStackParamList } from "../@types/navigation";
import PatientCard from "../components/PatientCard";

 const patients = [
    {
      id: "1",
      name: "Ana Beatriz",
      adherence: 92,
      lastActivity: "Hoje",
    },
    {
      id: "2",
      name: "Carlos Silva",
      adherence: 58,
      lastActivity: "Ontem",
    },
    {
      id: "3",
      name: "Juliana Mendes",
      adherence: 75,
      lastActivity: "2 dias atrás",
    },
  ];

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

      <Button title="Adicionar paciente" iconName="add" />

      <Text className="text-2xl font-nunito_bold text-gray-1 mt-4 mb-6">
        Pacientes
      </Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <PatientCard
            name={item.name}
            adherence={item.adherence}
            lastActivity={item.lastActivity}
            onPress={() => console.log("abrir detalhes", item.id)}
          />
        )}
      />
    
    </SafeAreaView>
  );
}
