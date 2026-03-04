import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { SafeAreaView } from "react-native-safe-area-context";
import PatientCard from "../components/PatientCard";
import { AdminNavigationProps } from "../routes/admin.routes";
import { getPatientsRequest } from "../services/patients";


export function HomeAdmin() {

  const navigation = useNavigation<AdminNavigationProps>()

  const {data: patients, isLoading} = useQuery({
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
            name={item.name}
            adherence={item.adherence}
            lastActivity={"hoje => mudar"}
            onPress={() => navigation.navigate("PatientDetails", {patientId: item.id})}
          />
        )}
      />
    
    </SafeAreaView>
  );
}
