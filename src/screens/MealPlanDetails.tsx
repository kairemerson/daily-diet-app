import { View, Text, ScrollView } from "react-native"
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native"
import dayjs from "dayjs"
import { getMealPlanByIdRequest } from "../services/mealPlan"
import { useQuery } from "@tanstack/react-query"
import { HeaderPage } from "../components/HeaderPage"
import { Button } from "../components/Button"
import { AdminNavigationProps } from "../routes/admin.routes"

type RouteProps = RouteProp<
  { MealPlanDetails: { mealPlanId: string } },
  "MealPlanDetails"
>

export function MealPlanDetails() {

    const navigation = useNavigation<AdminNavigationProps>()
  

    const route = useRoute<RouteProps>()
    const { mealPlanId } = route.params

    const { data: mealPlan, isLoading } = useQuery({
      queryKey: ["meal-plan", mealPlanId],
      queryFn: () => getMealPlanByIdRequest(mealPlanId),
      enabled: !!mealPlanId
    })

    // console.log("MealPLanDetails => mealPlan: ", mealPlan);
    

    if (isLoading || !mealPlan) {
      return <Text>Carregando...</Text>
    }

  return (
    <View className="flex-1 bg-gray-7">
      <HeaderPage title="Plano alimentar"/>
      <ScrollView className="px-6 pt-6 rounded-t-3xl bg-gray-7 -mt-5">

        {/* HEADER */}
        <View className="mb-6">

          <View className={`self-start px-3 py-1 mt-2 rounded-lg
            ${mealPlan.isActive ? "bg-green-light" : "bg-gray-6"}`}>
            
            <Text className={`text-xs font-nunito_bold
              ${mealPlan.isActive ? "text-green-dark" : "text-gray-3"}`}>
              {mealPlan.isActive ? "Plano ativo" : "Plano inativo"}
            </Text>

          </View>

          <Text className="text-lg font-nunito_bold text-gray-1 mt-6">
            {mealPlan.title}
          </Text>

          <Text className="text-gray-3 text-sm mt-2">
            {mealPlan.description}
          </Text>


        </View>

        {/* MACROS CARD */}
        <View className="bg-green-light rounded-2xl p-5 mb-4">

          <Text className="text-gray-1 font-nunito_bold mb-4">
            Metas nutricionais
          </Text>

          <View className="flex-row justify-between">

            <View className="items-center flex-1">
              <Text className="text-gray-3 text-xs">Calorias</Text>
              <Text className="text-lg font-nunito_bold text-gray-1">
                {mealPlan.caloriesTarget}
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-gray-3 text-xs">Proteína</Text>
              <Text className="text-lg font-nunito_bold text-gray-1">
                {mealPlan.proteinTarget}g
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-gray-3 text-xs">Carbs</Text>
              <Text className="text-lg font-nunito_bold text-gray-1">
                {mealPlan.carbsTarget}g
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-gray-3 text-xs">Gordura</Text>
              <Text className="text-lg font-nunito_bold text-gray-1">
                {mealPlan.fatTarget}g
              </Text>
            </View>

          </View>

        </View>

        {/* PERÍODO */}
        <View className="bg-white rounded-2xl p-5 mb-4">

          <Text className="text-gray-1 font-nunito_bold mb-2">
            Período
          </Text>

          <Text className="text-gray-3 font-nunito_regular">
            Início: {dayjs(mealPlan.startDate).format("DD/MM/YYYY")}
          </Text>

          {mealPlan.endDate && (
            <Text className="text-gray-3 font-nunito_regular">
              Fim: {dayjs(mealPlan.endDate).format("DD/MM/YYYY")}
            </Text>
          )}

        </View>

        {/* REFEIÇÕES */}
        <View className="bg-green-light rounded-2xl p-5 mb-6">

          <Text className="text-gray-1 font-nunito_bold mb-4">
            Refeições do plano
          </Text>

          {mealPlan.mealPlanItems?.length === 0 ? (
            <Text className="text-gray-4">
              Nenhuma refeição cadastrada
            </Text>
          ) : (
            mealPlan.mealPlanItems?.map((meal) => (

              <View
                key={meal.id}
                className="flex-row justify-between items-center mb-3"
              >

                <Text className="text-gray-1 font-nunito_bold">
                  {meal.name}
                </Text>

                <Text className="text-gray-3">
                  {meal.time}
                </Text>

              </View>

            ))
          )}

        </View>

      </ScrollView>

      <View className="mt-auto px-6 mb-20">
        <Button title="Editar Plano" variant="secondary" onPress={() => navigation.navigate("CreateMealPlan", {patientId: mealPlan.patientId, mealPlanId: mealPlan.id})}/>

      </View>

    </View>
  )
}