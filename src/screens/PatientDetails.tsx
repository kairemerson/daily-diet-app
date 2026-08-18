
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {  MaterialIcons } from "@expo/vector-icons"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { AppCard } from "../components/AppCard"
import { useQuery } from "@tanstack/react-query"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { AdminStackParamList } from "../@types/navigation"
import { AdminNavigationProps } from "../routes/admin.routes"
import { Button } from "../components/Button"
import { useBottomSheet } from "../contexts/BottomSheetContext"
import BodyMetricsForm from "../components/BodyMetricsForm"
import { colors } from "../theme/colors";
import { getDashboard } from "../services/patients";
import { MealPlanItemForm } from "../components/MealPlanItemForm";
import { PatientActionsMenu } from "../components/PatientActionsMenu";
import { Skeleton } from "../components/Skeleton";
import { HeaderPage } from "../components/HeaderPage";
import { LineChart } from 'react-native-gifted-charts';

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

    const {data: dashboard, isLoading} = useQuery({
      queryKey: ["dashboard", patientId],
      queryFn: () => getDashboard(patientId),
      enabled: !!patientId
    })

    const { width: windowWidth } = useWindowDimensions();

    // console.log("PatientDetails => dashboard: ", dashboard);
    
    // console.log("PatientDetails = bodyMetrics", calculatedBodyMetrics);
    
    if(isLoading || !dashboard){
      return (
        <View className="py-20 px-6">
          <Skeleton height={70}/>
          <Skeleton height={240} className="mt-4"/>
          <Skeleton height={220} className="mt-4"/>
          <Skeleton height={220} className="mt-4"/>

        </View>
      )
    }
    
    const {patient, metrics, mealPlans, adherence} = dashboard
    const activeMealPlan = mealPlans.find((mealPlan) => mealPlan.isActive)

    const previousMealPlans = mealPlans.filter((mealPlan) => !mealPlan.isActive).sort((a, b) => new  Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    console.log("PatientDetails = activeMealPlan", activeMealPlan);
    // console.log("PatientDetails = metrics", metrics);

    const hasLostWeight = metrics.weightDifference !== null && metrics.weightDifference < 0;
    const formattedWeightDiff = Math.abs(metrics.weightDifference ?? 0).toFixed(2);

    //dados formatados para o gráfico
    const chartData = metrics?.weightHistory?.map(item => ({
      value: item.weight,
      label: new Date(item.recordedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    })) ?? [];

    const hasChartData = chartData.length > 0;

  return (
    <View className="flex-1 bg-gray-7">
      <HeaderPage title="Detalhes do paciente"/>
      <View className="flex-1 bg-gray-7 rounded-t-3xl -mt-3">
      
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6 pt-4 mb-10"
        >
          {/* HEADER */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-nunito_bold text-gray-1">
                  {patient?.name}
                </Text>

                <View className="flex-row items-center mt-1">
                  <View className={`w-3 h-3 rounded-full mr-2 ${
                      patient.status === "ACTIVE" 
                        ? "bg-green-dark" 
                        : patient.status === "INACTIVE" 
                        ? "bg-red-dark" 
                        : "bg-gray-3"
                    }`} />
                  <Text className="text-sm text-gray-3">
                    {patient.status === "ACTIVE" ? "Paciente ativo" : patient.status === "INACTIVE" ? "Paciente inativo" : "Paciente pausado"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity className="w-12 h-12 rounded-2xl bg-white items-center justify-center shadow-sm"
                onPress={() => open(() => 
                  <PatientActionsMenu 
                    status={patient.status} 
                    patientId={patient.id} 
                    closeBottomSheet={close}
                  />, ["60%"])}
              >
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
                {metrics?.currentWeight?.toFixed(2) ?? "- "}kg
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-3 font-nunito_regular">
                Meta
              </Text>
              <Text className="text-gray-1 font-nunito_bold">
                {patient?.targetWeight?.toFixed(2)}kg
              </Text>
            </View>

              {metrics.weightDifference !== null && (
                <View className="gap-2 flex-row items-center">
                  <FontAwesome5 
                    name={hasLostWeight ? "arrow-down" : "arrow-up"} 
                    size={14} 
                    color={hasLostWeight ? colors.green.dark : colors.red.dark} 
                  />
                  <Text className={hasLostWeight ? "text-green-dark font-nunito_bold" : "text-red-dark font-nunito_bold"}>
                    {hasLostWeight ? `-${formattedWeightDiff} kg` : `+${formattedWeightDiff} kg`} desde o início
                  </Text>
                </View>
              )}

              {/* ÁREA DO GRÁFICO DE LINHA */}
              <View className="mt-4 pt-6 pb-2 -mx-4">
                {hasChartData ? (
                  <LineChart
                    data={chartData}
                    height={150}
                    
                    // 1. LARGURA E ESPAÇAMENTO AJUSTADOS
                    width={(windowWidth - 64 - 45)}
                    yAxisLabelWidth={45} // Reserva espaço fixo pro eixo Y
                    initialSpacing={20}
                    endSpacing={20} 

                    // Estilização da Linha
                    color={hasLostWeight ? colors.green.dark : colors.red.dark}
                    thickness={3}
                    curved
                    isAnimated
                    
                    // Pontos (Data Points)
                    dataPointsColor={hasLostWeight ? colors.green.dark : colors.red.dark}
                    dataPointsRadius={4}

                    // Eixo Y (Grade Lateral Esquerda)
                    noOfSections={3}
                    yAxisColor="transparent"
                    yAxisThickness={0}
                    yAxisTextStyle={{
                      color: '#9CA3AF',
                      fontSize: 10,
                      fontFamily: 'Nunito_400Regular',
                    }}
                    yAxisLabelSuffix="kg"

                    // Eixo X (Datas Abaixo)
                    xAxisColor="#E5E7EB"
                    xAxisThickness={1}
                    xAxisLabelTextStyle={{
                      color: '#9CA3AF',
                      fontSize: 10,
                      fontFamily: 'Nunito_400Regular',
                    }}

                    // Linhas de Grade Horizontais
                    rulesType="solid"
                    rulesColor="#F3F4F6"

                    // Sombra/Área abaixo
                    areaChart
                    startFillColor={hasLostWeight ? colors.green.dark : colors.red.dark}
                    endFillColor={hasLostWeight ? colors.green.dark : colors.red.dark}
                    startOpacity={0.15}
                    endOpacity={0.0}

                    // 2. TOOLTIP POSICIONADO ACIMA DO PONTEIRO
                    pointerConfig={{
                      pointerStripColor: hasLostWeight ? colors.green.dark : colors.red.dark,
                      pointerStripWidth: 1.5,
                      pointerColor: hasLostWeight ? colors.green.dark : colors.red.dark,
                      radius: 5,
                      pointerLabelWidth: 80,
                      pointerLabelHeight: 30,
                      autoAdjustPointerLabelPosition: true, // Ajusta automático nas bordas
                      pointerLabelComponent: (items: any) => (
                        <View className="bg-gray-1 px-2 py-1 rounded shadow-md items-center justify-center self-center -ml-6">
                          <Text className="text-white text-xs font-nunito_bold">
                            {items[0]?.value?.toFixed(1)} kg
                          </Text>
                        </View>
                      ),
                    }}
                  />
                ) : (
                  <View className="h-32 bg-gray-6 rounded-xl mx-4 items-center justify-center">
                    <Text className="text-gray-4 font-nunito_regular text-sm">
                      Sem dados de histórico de peso
                    </Text>
                  </View>
                )}
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
                  {metrics?.currentBodyFat?.toFixed(0) ?? "- "}%
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-gray-3 text-sm">
                  Massa magra
                </Text>
                <Text className="text-xl font-nunito_bold text-gray-1 mt-1">
                  {metrics?.currentMuscleMass?.toFixed(2) ?? "- "}kg
                </Text>
              </View>
            </View>
          </AppCard>

          {/* PLANO ALIMENTAR */}
          <AppCard title="Plano Alimentar Ativo" icon="restaurant-menu">
            {activeMealPlan ? (
              <View>
                {/* Título e Status */}
                <View className="flex-row justify-between items-center gap-3 mb-2">
                  <View className="max-w-[80%]">
                    <Text className="text-gray-1 font-nunito_bold text-lg" numberOfLines={1}>
                      {activeMealPlan.title}
                    </Text>
                    {activeMealPlan.description && (
                      <Text className="text-gray-3 font-nunito_regular leading-4 text-xs" numberOfLines={2}>
                        {activeMealPlan.description}
                      </Text>
                    )}
                  </View>

                  <View className="bg-green-light px-3 py-1 rounded-lg">
                    <Text className="text-green-dark text-xs font-nunito_bold">
                      Ativo
                    </Text>
                  </View>
                </View>

                {/* 1. RESUMO MACRONUTRICIONAL ALVO */}
                <View className="bg-gray-7 p-3 rounded-xl my-3 flex-row justify-around items-center">
                  <View className="items-center">
                    <Text className="text-gray-3 text-xs font-nunito_regular">Calorias</Text>
                    <Text className="text-gray-1 font-nunito_bold text-sm mt-0.5">
                      {activeMealPlan.caloriesTarget ?? 0} kcal
                    </Text>
                  </View>

                  <View className="w-[1px] h-6 bg-gray-5" />

                  <View className="items-center">
                    <Text className="text-gray-3 text-xs font-nunito_regular">Proteínas</Text>
                    <Text className="text-gray-1 font-nunito_bold text-sm mt-0.5">
                      {activeMealPlan.proteinTarget ?? 0}g
                    </Text>
                  </View>

                  <View className="w-[1px] h-6 bg-gray-5" />

                  <View className="items-center">
                    <Text className="text-gray-3 text-xs font-nunito_regular">Carbos</Text>
                    <Text className="text-gray-1 font-nunito_bold text-sm mt-0.5">
                      {activeMealPlan.carbsTarget ?? 0}g
                    </Text>
                  </View>

                  <View className="w-[1px] h-6 bg-gray-5" />

                  <View className="items-center">
                    <Text className="text-gray-3 text-xs font-nunito_regular">Gorduras</Text>
                    <Text className="text-gray-1 font-nunito_bold text-sm mt-0.5">
                      {activeMealPlan.fatTarget ?? 0}g
                    </Text>
                  </View>
                </View>

                {/* 2. LISTA DE REFEIÇÕES / ITENS DO PLANO */}
                {activeMealPlan.mealPlanItems && activeMealPlan.mealPlanItems.length > 0 && (
                  <View className="mt-1 mb-4 gap-2">
                    <Text className="text-gray-3 text-xs font-nunito_bold mb-1 uppercase tracking-wider">
                      Refeições ({activeMealPlan.mealPlanItems.length})
                    </Text>

                    {activeMealPlan.mealPlanItems
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <View 
                          key={item.id} 
                          className="flex-row justify-between items-center bg-gray-7 px-3 py-2.5 rounded-lg"
                        >
                          <View className="flex-row items-center gap-2">
                            {item.time && (
                              <Text className="text-green-dark font-nunito_bold text-xs bg-green-light px-1.5 py-0.5 rounded">
                                {item.time}
                              </Text>
                            )}
                            <Text className="text-gray-1 font-nunito_bold text-sm">
                              {item.name}
                            </Text>
                          </View>

                          {item.targetCalories && (
                            <Text className="text-gray-3 font-nunito_regular text-xs">
                              {item.targetCalories} kcal
                            </Text>
                          )}
                        </View>
                      ))}
                  </View>
                )}

                {/* BOTÕES DE AÇÃO */}
                <View className="gap-2 mt-2">
                  <Button 
                    title="Adicionar item" 
                    onPress={() => open(() => <MealPlanItemForm mealPlanId={activeMealPlan.id} closeBottomSheet={close} />, ["90%"])}
                  />
                  <Button 
                    title="Editar Plano" 
                    variant="secondary" 
                    onPress={() => navigation.navigate("CreateMealPlan", { patientId, mealPlanId: activeMealPlan.id })}
                  />
                </View>
              </View>
            ) : (
              <Text className="font-nunito_regular text-center text-gray-4 my-2">
                Sem plano ativo, crie um plano para o paciente
              </Text>
            )}

            {/* HISTÓRICO DE PLANOS ANTERIORES */}
            {previousMealPlans.length > 0 && (
              <>
                <View className="h-[1px] bg-gray-5 mt-6 mb-3" />

                <Text className="text-gray-4 text-sm font-nunito_bold mb-2">
                  Planos anteriores
                </Text>

                <View className="gap-2">
                  {previousMealPlans.slice(0, 2).map((plan) => (
                    <TouchableOpacity
                      key={plan.id}
                      className="flex-row justify-between items-center bg-gray-7 p-3 rounded-lg"
                      onPress={() =>
                        navigation.navigate("CreateMealPlan", {
                          patientId,
                          mealPlanId: plan.id,
                        })
                      }
                    >
                      <View>
                        <Text className="text-gray-1 font-nunito_bold">
                          {plan.title}
                        </Text>
                        <Text className="text-gray-3 text-xs">
                          {plan.caloriesTarget} kcal
                        </Text>
                      </View>

                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  className="mt-3"
                  onPress={() =>
                    navigation.navigate("MealPlansHistory", { patientId })
                  }
                >
                  <Text className="text-green-dark font-nunito_bold">
                    Ver todos os planos →
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
              <View className={` bg-green-dark h-full rounded-full`} 
                style={{
                  width: `${adherence?.last7Days ?? 0}%`
                }}
              />
            </View>
          </AppCard>

          <AppCard title="Refeições recentes">
                <TouchableOpacity onPress={() => navigation.navigate("MealHistory", {patientId})} activeOpacity={0.7}>
                  <Text className="text-green-dark font-nunito_bold">Ver histórico →</Text>
                </TouchableOpacity>
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
            <Button title="Criar Novo Plano" variant="primary" onPress={() => navigation.navigate("CreateMealPlan", {patientId})}/>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}