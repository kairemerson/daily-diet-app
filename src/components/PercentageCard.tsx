import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "../routes/app.routes";
import { useQuery } from "@tanstack/react-query";
import { getMealsMetricsRequest } from "../services/meals";


export function PercentageCard() {

    const navitagion = useNavigation<AppNavigationProps>()

    const {data: metrics} = useQuery({
      queryKey: ["metrics"],
      queryFn: getMealsMetricsRequest,
      initialData: {
        percentageOnDiet: 0,
        bestSequence: 0,
        total: 0,
        totalOnDiet: 0,
        totalOffDiet: 0,
      }
    })

    const isPositive = metrics.percentageOnDiet >= 90;

  return (
    <TouchableOpacity
      className={`w-full rounded-xl p-5 mb-6 ${
        isPositive ? "bg-green-light" : "bg-red-light"
      }`}
      onPress={() => navitagion.navigate("Statistics", {
        percentage: metrics.percentageOnDiet,
        bestSequence: metrics.bestSequence,
        totalMeals: metrics.total,
        insideDiet: metrics.totalOnDiet,
        outsideDiet: metrics.totalOffDiet,
      })}
    >
      <View className="items-center">
        <Text className="text-2xl font-bold text-gray-900">
          {metrics.percentageOnDiet}%
        </Text>
        <Text className="text-gray-600 text-sm">
          das refeições dentro da dieta
        </Text>
      </View>

      <View className="absolute top-3 right-3">
        <MaterialIcons name="arrow-upward" size={22} className="text-red-800 rotate-45"/>
      </View>
    </TouchableOpacity>
  );
}
