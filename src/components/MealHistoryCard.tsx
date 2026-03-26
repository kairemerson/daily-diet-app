import { Text, TouchableOpacity, View } from "react-native"

export function MealHistoryCard({ meal }) {

  const status = meal.isOnDiet
    ? "text-green-dark"
    : "text-red-dark"

  const statusColor = meal.isOnDiet ? "bg-green-mid" : "bg-red-mid";
  const statusBg = meal.isOnDiet ? "bg-green-light" : "bg-red-light";

  return (

  <TouchableOpacity 
      activeOpacity={0.7}
      className="bg-white p-4 rounded-xl mb-3 flex-row items-center border border-gray-6 shadow-sm"
    >
      {/* 1. Indicador Visual Lateral (Ponto de cor) */}
      <View className={`w-1 h-12 rounded-full ${statusColor} mr-4`} />

      <View className="flex-1">
        {/* 2. Cabeçalho: Nome e Hora lado a lado */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-nunito_bold text-base text-gray-1 flex-1 mr-2" numberOfLines={1}>
            {meal.name}
          </Text>
          <Text className="font-nunito_regular text-xs text-gray-4">
            {meal.time}
          </Text>
        </View>

        {/* 3. Rodapé do Card: Calorias e Badge de Status */}
        <View className="flex-row items-center justify-between">
          <Text className="font-nunito_regular text-sm text-gray-3">
            🔥 <Text className="font-nunito_bold text-gray-2">{meal.consumedCalories}</Text> kcal
          </Text>

          {/* Badge estilizado */}
          <View className={`px-3 py-1 rounded-full ${statusBg}`}>
            <Text 
              className={`font-nunito_bold text-[10px] uppercase tracking-wider ${meal.isOnDiet ? 'text-green-dark' : 'text-red-dark'}`}
            >
              {meal.isOnDiet ? "Na Dieta" : "Fora"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}