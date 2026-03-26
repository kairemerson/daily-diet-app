import { Text, View, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import dayjs from "dayjs"
import { MealPlanWithMealPlanItems } from "../services/mealPlan"
import { useNavigation } from "@react-navigation/native"
import { AdminNavigationProps } from "../routes/admin.routes"

type Props = {
  mealPlan: MealPlanWithMealPlanItems
}

export function MealPlanCard({ mealPlan }: Props) {

  const navigation = useNavigation<AdminNavigationProps>()
  
  const mealsCount = mealPlan.mealPlanItems?.length ?? 0

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MealPlanDetails", {mealPlanId: mealPlan.id})}
      activeOpacity={0.8}
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-6"
    >
      
      {/* HEADER */}
      <View className="flex-row justify-between items-start mb-3">

        <View className="flex-1 pr-3">
          <Text
            className="text-lg font-nunito_bold text-gray-1"
            numberOfLines={1}
          >
            {mealPlan.title}
          </Text>

          <Text className="text-gray-4 text-xs mt-1">
            Criado em {dayjs(mealPlan.createdAt).format("DD/MM/YYYY")}
          </Text>
        </View>

        {mealPlan.isActive && (
          <View className="bg-green-light px-3 py-1 rounded-lg">
            <Text className="text-green-dark text-xs font-nunito_bold">
              ATIVO
            </Text>
          </View>
        )}
      </View>

      {/* INFO GRID */}
      <View className="flex-row justify-between bg-gray-7 rounded-xl p-3">

        {/* CALORIAS */}
        <View className="items-center flex-1">
          <MaterialIcons name="local-fire-department" size={20} color="#F97316" />
          <Text className="text-gray-1 font-nunito_bold mt-1">
            {mealPlan.caloriesTarget}
          </Text>
          <Text className="text-gray-4 text-xs">
            kcal
          </Text>
        </View>

        {/* DIVIDER */}
        <View className="w-px bg-gray-6 mx-2"/>

        {/* REFEIÇÕES */}
        <View className="items-center flex-1">
          <MaterialIcons name="restaurant-menu" size={20} color="#22C55E" />
          <Text className="text-gray-1 font-nunito_bold mt-1">
            {mealsCount}
          </Text>
          <Text className="text-gray-4 text-xs">
            refeições
          </Text>
        </View>

      </View>

      {/* Macros */}
      <View className="flex-row justify-center mt-3 gap-4">

        <View className="flex-row items-center bg-gray-7 px-2 py-1 rounded-md">
          <Text className="text-xs font-nunito_bold text-gray-1">
            {mealPlan.proteinTarget}P
          </Text>
        </View>

        <View className="flex-row items-center bg-gray-7 px-2 py-1 rounded-md">
          <Text className="text-xs font-nunito_bold text-gray-1">
            {mealPlan.carbsTarget}C
          </Text>
        </View>

        <View className="flex-row items-center bg-gray-7 px-2 py-1 rounded-md">
          <Text className="text-xs font-nunito_bold text-gray-1">
            {mealPlan.fatTarget}G
          </Text>
        </View>

      </View>

      {/* CTA */}
      <View className="flex-row justify-end items-center mt-4">
        <Text className="text-green-dark font-nunito_bold text-sm mr-1">
          Ver plano
        </Text>
        <MaterialIcons name="chevron-right" size={18} color="#16A34A" />
      </View>

    </TouchableOpacity>
  )
}