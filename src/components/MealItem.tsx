import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  time: string;
  title: string;
  isOnDiet: boolean;
};

export function MealItem({ time, title, isOnDiet }: Props) {
  return (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 border border-gray-200 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Text className="font-bold">{time}</Text>

        <View className="h-4 w-px bg-gray-300" />

        <Text className="text-gray-700">{title}</Text>
      </View>

      <View
        className={`w-3 h-3 rounded-full ${
          isOnDiet ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </TouchableOpacity>
  );
}
