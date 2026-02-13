import { View, Text, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "../@types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { NavigationProps } from "./Home";

type RouteProps = RouteProp<AppStackParamList, "Statistics">;


export function Statistics() {

        const route = useRoute<RouteProps>()

        const {percentage, bestSequence, insideDiet, outsideDiet, totalMeals} = route.params
        const isPositive = percentage > 80

        const navigation = useNavigation<NavigationProps>()

     return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className={`pt-16 pb-8 px-6 items-center ${
            isPositive ? "bg-green-light" : "bg-red-light"
        }`}
      >
        <TouchableOpacity activeOpacity={0.7} className="mr-auto p-1" onPress={() => navigation.navigate("Home")}>
            <MaterialIcons name="arrow-back" size={24} color={colors.green.dark}/>
        </TouchableOpacity>
        <Text className="font-nunito_bold text-2xl text-gray-1">
          {percentage.toFixed(2)}%
        </Text>
        <Text className="font-nunito_regular text-sm text-gray-2">
          das refeições dentro da dieta
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8">
        <Text className="text-center font-nunito_bold text-base text-gray-1 mb-6">
          Estatísticas gerais
        </Text>

        {/* Melhor sequência */}
        <View className="bg-gray-6 rounded-xl p-4 items-center mb-3">
          <Text className="font-nunito_bold text-xl text-gray-1">
            {bestSequence}
          </Text>
          <Text className="font-nunito_regular text-sm text-gray-2 text-center">
            melhor sequência de pratos dentro da dieta
          </Text>
        </View>

        {/* Total registradas */}
        <View className="bg-gray-6 rounded-xl p-4 items-center mb-3">
          <Text className="font-nunito_bold text-xl text-gray-1">
            {totalMeals}
          </Text>
          <Text className="font-nunito_regular text-sm text-gray-2 text-center">
            refeições registradas
          </Text>
        </View>

        {/* Grid inferior */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-green-light rounded-xl p-4 items-center">
            <Text className="font-nunito_bold text-xl text-gray-1">
              {insideDiet}
            </Text>
            <Text className="font-nunito_regular text-sm text-gray-2 text-center">
              refeições dentro da dieta
            </Text>
          </View>

          <View className="flex-1 bg-red-light rounded-xl p-4 items-center">
            <Text className="font-nunito_bold text-xl text-gray-1">
              {outsideDiet}
            </Text>
            <Text className="font-nunito_regular text-sm text-gray-2 text-center">
              refeições fora da dieta
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}