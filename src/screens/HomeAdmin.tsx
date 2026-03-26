import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { SafeAreaView } from "react-native-safe-area-context";
import { AdminNavigationProps } from "../routes/admin.routes";
import { getPatientsRequest } from "../services/patients";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { Skeleton } from "../components/Skeleton";
import { AnimatedPatientCard } from "../components/AnimatedPatientCard";


export function HomeAdmin() {

  const navigation = useNavigation<AdminNavigationProps>()

  const {data: patients=[], isLoading} = useQuery({
    queryKey: ["patients"],
    queryFn: getPatientsRequest,
  })

  // console.log("HomeAdmin = patients: ", patients);
  
    
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 mt-4">
       
        <Image source={require("../assets/logo-horizontal.png")} style={{ width: 100, height: undefined, aspectRatio: 134 / 42 }} resizeMode="contain" />

        <TouchableOpacity onPress={() => navigation.navigate("NutritionistProfile")} >
          <View className="w-10 h-10 rounded-full bg-gray-300" />

        </TouchableOpacity>
      </View>

      

      <Text className="text-2xl font-nunito_bold text-gray-1 mt-4 mb-6">
        Pacientes
      </Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <AnimatedPatientCard
            index={index}
            name={item.name}
            adherence={item.adherence}
            lastActivity={item.lastActivity}
            onPress={() => navigation.navigate("PatientDetails", {patientId: item.id})}
          />
        )}
        ListEmptyComponent={() => {
          if(isLoading) {
            return (
              <> 
                <Skeleton width={"100%"} height={60}/>
                <Skeleton width={"100%"} height={60} className="mt-4"/>
                <Skeleton width={"100%"} height={60} className="mt-4"/>
                <Skeleton width={"100%"} height={60} className="mt-4"/>
              </>

            )
          } else {
            return (
              <>
                <Text className="font-nunito_regular text-gray-3 text-center mt-20">Nenhum paciente adicionado.</Text>
                <Text className="font-nunito_regular text-gray-3 text-center mt-1">Adicione um paciente!</Text>
              </>
            )
          }
        }
          
        }
      />

      <TouchableOpacity onPress={() => navigation.navigate("PatientCreateForm")} className="items-center justify-center bg-green-dark rounded-full w-16 h-16 ml-auto mb-6">
        <MaterialIcons name="add" size={24} color={colors.white}/>

      </TouchableOpacity>
    
    </SafeAreaView>
  );
}
