
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {  MaterialIcons } from "@expo/vector-icons"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AppCard } from "../components/AppCard"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PatientProfile } from "../types/patients"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { AdminStackParamList } from "../@types/navigation"
import { AdminNavigationProps } from "../routes/admin.routes"
import { Button } from "../components/Button"
import { getMealPlanRequest } from "../services/mealPlan"
import { useBottomSheet } from "../contexts/BottomSheetContext"
import BodyMetricsForm from "../components/BodyMetricsForm"
import { getBodyMetricsRequest } from "../services/bodyMetrics"
import { colors } from "../theme/colors";
import { getDashboard } from "../services/patients";
import { MealPlanItemForm } from "../components/MealPlanItemForm";

type RouteProps = RouteProp<AdminStackParamList, "PatientDetails">
    

const VARIANT_GOALS = {
  WEIGHT_LOSS: "EMAGRECIMENTO",
  HYPERTROPHY:"HIPERTROFIA",
  REEDUCATION: "REEDUCAÇÃO",
  MAINTENANCE :"MANTER"
}

export function PatientDetails() {

    const navigation = useNavigation<AdminNavigationProps>()

    const {open, close} = useBottomSheet()

    const route = useRoute<RouteProps>()
    const {patientId} = route.params

    const queryClient = useQueryClient()

    // const patients = queryClient.getQueryData<PatientProfile[]>(["patients"])
    // const patient = patients?.find((p) => p.id === patientId)

    // const {data: mealPlans} = useQuery({
    //   queryKey: ["meal-plans", patientId],
    //   queryFn: () => getMealPlanRequest(patientId),
    //   enabled: !!patientId
    // })

    // const {data: calculatedBodyMetrics} = useQuery({
    //   queryKey: ["body-metrics", patientId],
    //   queryFn: () => getBodyMetricsRequest(patientId),
    //   enabled: !!patientId
    // })

    const {data: dashboard, isLoading} = useQuery({
      queryKey: ["dashboard", patientId],
      queryFn: () => getDashboard(patientId),
      enabled: !!patientId
    })

    // console.log("PatientDetails => dashboard: ", dashboard);
    

    
    // console.log("PatientDetails = mealPlans", mealPlans);
    // console.log("PatientDetails = bodyMetrics", calculatedBodyMetrics);
    
    if(isLoading){
      return <Text>carregando...</Text>
    }

    const {patient, metrics, activeMealPlan, adherence} = dashboard

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
                {patient?.name}
              </Text>

              <View className="flex-row items-center mt-1">
                <View className="w-3 h-3 rounded-full bg-green-dark mr-2" />
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
              {metrics?.currentWeight}kg
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-3 font-nunito_regular">
              Meta
            </Text>
            <Text className="text-gray-1 font-nunito_bold">
              {patient?.targetWeight}kg
            </Text>
          </View>

            { metrics?.weightDifference &&
              metrics.weightDifference < 0 ? (
                <View className="gap-2 flex-row items-center">
                  <FontAwesome5  name="arrow-down" size={14} color={colors.green.dark} />
                  <Text className="text-green-dark font-nunito_bold">
                    {metrics.weightDifference + " "} desde início
                  </Text>
                </View>
              ) : (
                <View className="gap-2 flex-row items-center">
                  <FontAwesome5  name="arrow-up" size={14} color={colors.red.dark} />
                  <Text className="text-red-dark font-nunito_bold">
                    +{metrics?.weightDifference + " "} desde início
                  </Text>
                </View>
              )
            }

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
                {/* {patient?.goal} */}
                {patient?.goal && VARIANT_GOALS[patient.goal]}
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
                {metrics?.currentBodyFat}%
              </Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-gray-3 text-sm">
                Massa magra
              </Text>
              <Text className="text-xl font-nunito_bold text-gray-1 mt-1">
                {metrics?.currentMuscleMass}kg
              </Text>
            </View>
          </View>
        </AppCard>

        {/* PLANO ALIMENTAR */}
        <AppCard title="Plano Alimentar Ativo" icon="restaurant-menu">

          
          <View className="flex-row justify-between items-center mb-3">
            <View className="">
              <Text className="text-gray-1 font-nunito_bold" numberOfLines={1}>
                {activeMealPlan?.title}
              </Text>
              {
                activeMealPlan.description && (
                  <Text className="text-gray-3 font-nunito_regular" numberOfLines={2}>
                    {activeMealPlan.description}
                  </Text>
                )
              }

            </View>
            <View className={`${activeMealPlan?.isActive ? "bg-green-light" : "bg-red-light"} px-3 py-1  rounded-lg`}>
              <Text className={`${activeMealPlan?.isActive ? "text-green-dark" : "text-red-dark"} text-xs font-nunito_bold`}>
                {activeMealPlan?.isActive ? "Ativo" : "Inativo"}
              </Text>
            </View>
          </View>

          <Text className="text-gray-3 text-sm mb-4">
            150g proteína • 180g carbo • 60g gordura
          </Text>
          
          <View className="gap-3">
            <Button title="Adicionar item" onPress={() => open(() => <MealPlanItemForm mealPlanId={activeMealPlan.id} closeBottomSheet={close} />, ["100%"])}/>
            <Button title="Editar Plano" variant="secondary"/>
          </View>
              
        </AppCard>

        {/* ADERÊNCIA */}
        <AppCard title="Aderência (7 dias)" icon="insights">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-3">
              Refeições dentro da dieta
            </Text>
            <Text className="text-green-dark font-nunito_bold">
              {adherence?.last7Days}%
            </Text>
          </View>

          <View className="h-3 bg-gray-6 rounded-full mt-4 overflow-hidden">
            <View className="w-4/5 bg-green-dark h-full rounded-full" />
          </View>
        </AppCard>

        {/* OBSERVAÇÕES */}
        <AppCard title="Observações" icon="notes">
          <Text className="text-gray-3 leading-tight">
            {patient?.observation}
          </Text>
        </AppCard>

        {/* AÇÕES RÁPIDAS */}
        <View className="mt-4 mb-12 gap-3">
          
          <Button title="Adicionar Métricas" onPress={() => open(() => <BodyMetricsForm patientId={patientId} closeBottomSheet={close} />, ["65%"])}/>
          <Button title="Criar Novo Plano" variant="secondary" onPress={() => navigation.navigate("CreateMealPlan", {patientId})}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}