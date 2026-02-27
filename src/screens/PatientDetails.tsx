
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from "@expo/vector-icons"
import { AppCard } from "../components/AppCard"

export function PatientDetails() {
  const patient = {
    name: "Ana Beatriz",
    status: "ACTIVE",
    currentWeight: 72,
    targetWeight: 65,
    goal: "WEIGHT_LOSS",
    bodyFat: 24,
    muscleMass: 32,
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-7">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-6 pt-6"
      >
        {/* HEADER */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-nunito_bold text-gray-1">
                {patient.name}
              </Text>

              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 rounded-full bg-green-dark mr-2" />
                <Text className="text-sm text-gray-3">
                  Paciente ativo
                </Text>
              </View>
            </View>

            <TouchableOpacity className="w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-sm">
              <MaterialIcons
                name="more-vert"
                size={22}
                color="#1B1D1E"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* PROGRESSO */}
        <AppCard title="Progresso Atual" icon="trending-up">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-3 font-nunito_regular">
              Peso atual
            </Text>
            <Text className="text-gray-1 font-nunito_bold">
              {patient.currentWeight}kg
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-3 font-nunito_regular">
              Meta
            </Text>
            <Text className="text-gray-1 font-nunito_bold">
              {patient.targetWeight}kg
            </Text>
          </View>

          <Text className="text-green-dark font-nunito_bold mt-2">
            ↓ -3kg desde início
          </Text>

          <View className="h-32 bg-gray-6 rounded-xl mt-4 items-center justify-center">
            <Text className="text-gray-4">
              gráfico linha peso
            </Text>
          </View>
        </AppCard>

        {/* OBJETIVO */}
        <AppCard title="Objetivo" icon="flag">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-3 font-nunito_regular">
              Meta atual
            </Text>
            <View className="px-4 py-2 bg-green-light rounded-xl">
              <Text className="text-green-dark font-nunito_bold">
                Emagrecimento
              </Text>
            </View>
          </View>
        </AppCard>

        {/* MÉTRICAS */}
        <AppCard title="Métricas Corporais" icon="monitor-weight">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-gray-3 text-sm">
                Gordura
              </Text>
              <Text className="text-xl font-nunito_bold text-gray-1 mt-1">
                {patient.bodyFat}%
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-gray-3 text-sm">
                Massa magra
              </Text>
              <Text className="text-xl font-nunito_bold text-gray-1 mt-1">
                {patient.muscleMass}kg
              </Text>
            </View>
          </View>
        </AppCard>

        {/* PLANO ALIMENTAR */}
        <AppCard title="Plano Alimentar Ativo" icon="restaurant-menu">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-1 font-nunito_bold">
              Cutting - 1800kcal
            </Text>
            <View className="px-3 py-1 bg-green-light rounded-lg">
              <Text className="text-green-dark text-xs font-nunito_bold">
                ATIVO
              </Text>
            </View>
          </View>

          <Text className="text-gray-3 text-sm mb-4">
            150g proteína • 180g carbo • 60g gordura
          </Text>

          <TouchableOpacity className="bg-gray-6 py-3 rounded-xl items-center">
            <Text className="font-nunito_bold text-gray-1">
              Editar Plano
            </Text>
          </TouchableOpacity>
        </AppCard>

        {/* ADERÊNCIA */}
        <AppCard title="Aderência (7 dias)" icon="insights">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-3">
              Refeições dentro da dieta
            </Text>
            <Text className="text-green-dark font-nunito_bold">
              82%
            </Text>
          </View>

          <View className="h-3 bg-gray-6 rounded-full mt-4 overflow-hidden">
            <View className="w-4/5 bg-green-dark h-full rounded-full" />
          </View>
        </AppCard>

        {/* OBSERVAÇÕES */}
        <AppCard title="Observações" icon="notes">
          <Text className="text-gray-3 leading-tight">
            Paciente relata dificuldade em manter dieta nos finais
            de semana. Sugestão: flexibilizar sábado.
          </Text>
        </AppCard>

        {/* AÇÕES RÁPIDAS */}
        <View className="mt-4 mb-10">
          <TouchableOpacity className="bg-green-dark py-4 rounded-2xl items-center mb-3">
            <Text className="text-white font-nunito_bold">
              Adicionar Métricas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-6 py-4 rounded-2xl items-center">
            <Text className="text-gray-1 font-nunito_bold">
              Criar Novo Plano
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}