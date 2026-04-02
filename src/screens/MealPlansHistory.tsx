import { useQuery } from "@tanstack/react-query"
import { FlatList, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MealPlanCard } from "../components/MealPlanCard"
import { RouteProp, useRoute } from "@react-navigation/native"
import { AdminStackParamList } from "../@types/navigation"
import { HeaderPage } from "../components/HeaderPage"
import { getMealsByPatientIdRequest } from "../services/meals"
import { getMealPlansByPatientRequest } from "../services/mealPlan"

type RouteProps = RouteProp<AdminStackParamList, "MealPlansHistory">


export function MealPlansHistory() {

  const route = useRoute<RouteProps>()
  const {patientId} = route.params

  const { data: mealPlans, isLoading } = useQuery({
    queryKey: ["meal-plans", patientId],
    queryFn: () => getMealPlansByPatientRequest(patientId),
    enabled: !!patientId
  })

  if(isLoading || !mealPlans){
    return <Text>carregando...</Text>
  }  

  return (
    <View className="flex-1 bg-gray-7">

      <HeaderPage title="Planos alimentares"/>
      <View className="flex-1 bg-gray-7 rounded-t-3xl pt-3 -mt-5">


        <FlatList
          data={mealPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MealPlanCard mealPlan={item} />
          )}
          contentContainerStyle={{paddingHorizontal: 16, marginTop: 16}}
        />

      </View>

    </View>
  )
}