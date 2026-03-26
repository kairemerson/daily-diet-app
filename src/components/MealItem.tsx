import { View, Text, TouchableOpacity } from "react-native";
import { formatHour } from "../utils/formatHour";
import { useNavigation } from "@react-navigation/native";
import { PatientNavigationProps } from "../routes/patient.routes";

type Props = {
  id: string
  time: string;
  title: string;
  isOnDiet: boolean;
};

export function MealItem({id, time, title, isOnDiet }: Props) {

  const navigation = useNavigation<PatientNavigationProps>()

  return (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 border border-gray-200 flex-row items-center justify-between"
      onPress={() => navigation.navigate("MealDetails", {id})}
    >
      <View className="flex-row items-center gap-3">
        <Text className="font-bold">{time}</Text>

        <View className="h-4 w-px bg-gray-300" />

        <Text className="text-base text-gray-3 font-nunito_regular">{title}</Text>
      </View>

      <View
        className={`w-[14] h-[14] rounded-full ${
          isOnDiet ? "bg-green-mid" : "bg-red-mid"
        }`}
      />
    </TouchableOpacity>
  );
}
