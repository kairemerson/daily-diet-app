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
import { useBottomSheet } from "../contexts/BottomSheetContext";
import { PatientCreateForm } from "../components/PatientCreateForm";
import { AdminNavigationProps } from "../routes/admin.routes";
import { getPatientsRequest } from "../services/patients";


export function HomeAdmin() {

  const navigation = useNavigation<AdminNavigationProps>()

  const {data: patients = [], isLoading} = useQuery({
    queryKey: ["patients"],
    queryFn: getPatientsRequest,
  })

  // console.log("HomeAdmin = patients: ", patients);
  
    
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8 mt-4">
        <Text className="text-xl font-bold">
          Daily Diet
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("NutritionistProfile")} >
          <View className="w-10 h-10 rounded-full bg-gray-300" />

        </TouchableOpacity>
      </View>

      <Button title="Adicionar paciente" iconName="add" onPress={() => navigation.navigate("PatientCreateForm")}/>
      

      <Text className="text-2xl font-nunito_bold text-gray-1 mt-4 mb-6">
        Pacientes
      </Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <PatientCard
            name={item.user.name}
            adherence={80}
            lastActivity={"hoje"}
            onPress={() => navigation.navigate("PatientDetails", {patientId: item.id})}
          />
        )}
      />
    
    </SafeAreaView>
  );
}
