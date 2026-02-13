import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../screens/Home";

type Props = {
  percentage: number;
};

export function PercentageCard({ percentage }: Props) {

  const navitagion = useNavigation<NavigationProps>()

  const isPositive = percentage >= 80;

  return (
    <TouchableOpacity
      className={`w-full rounded-xl p-5 mb-6 ${
        isPositive ? "bg-green-light" : "bg-red-light"
      }`}
      onPress={() => navitagion.navigate("Statistics", {
        percentage: 90,
        bestSequence: 22,
        totalMeals: 109,
        insideDiet: 99,
        outsideDiet: 10,
      })}
    >
      <View className="items-center">
        <Text className="text-2xl font-bold text-gray-900">
          {percentage.toFixed(2)}%
        </Text>
        <Text className="text-gray-600 text-sm">
          das refeições dentro da dieta
        </Text>
      </View>

      <View className="absolute top-3 right-3">
        <MaterialIcons name="arrow-upward" size={22} className="text-red-800"/>
      </View>
    </TouchableOpacity>
  );
}
