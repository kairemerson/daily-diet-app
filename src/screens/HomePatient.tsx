import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { PatientNavigationProps } from "../routes/patient.routes";
import { getPatientDashboard } from "../services/patients";
import { Feather } from "@expo/vector-icons";
import { convertDateToHour } from "../utils/convertDateToHour";
import { AppCard } from "../components/AppCard";
import dayjs from "dayjs";
import { formatTimeLeft } from "../utils/formatTimeLeft";

export function HomePatient() {
    const { signOut, user } = useAuth();
    const navigation = useNavigation<PatientNavigationProps>();

    const { data: dashboard, isLoading, isError } = useQuery({
        queryKey: ["patient-dashboard"],
        queryFn: getPatientDashboard,
    });

    if(isLoading || !dashboard){
        return <Text>carregando...</Text>
    }
 
    if(isError) return <Text>Erro ao carregar</Text>

    console.log("HomePatient => dashboard: ", dashboard);

    const currentStreak = dashboard?.streak?.currentStreak ?? 0
    const bestStreak = dashboard?.streak?.bestStreak ?? 0
    const period = dashboard?.streak?.period ?? 0
    
    const mealPlanItems = dashboard?.activeMealPlan?.mealPlanItems || [];

    const sortedMeals = [...mealPlanItems].sort((a,b)=>a.order-b.order)
    // console.log(JSON.stringify(mealPlanItems, null, 2))

    const now = dayjs()

    const nextMeal = mealPlanItems
        .map((mealPlanItem: any) => {
            if (!mealPlanItem?.time) return null

            const [hour, minute] = mealPlanItem.time.split(":")

            const todayTime = dayjs().hour(Number(hour)).minute(Number(minute))

            return {
                ...mealPlanItem,
                todayTime,
            }
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.todayTime.valueOf() - b.todayTime.valueOf())
        .find((meal: any) => meal.todayTime.isAfter(now))

    const minutesLeft = nextMeal
        ? nextMeal.todayTime.diff(now, "minute")
        : 0

    function getMealStatus(item: any) {
        if (item.completedToday && item.isOnDietToday) {
            return { label: "Dentro da dieta", color: "text-green-500" }
        }

        if (item.completedToday && item.isOnDietToday === false) {
            return { label: "Fora da dieta", color: "text-red-500" }
        }

        return { label: "Pendente", color: "text-yellow-500" }
    }

    function getMotivation(adherence: number) {
        if (adherence >= 85) return "Excelente consistência 💪"
        if (adherence >= 60) return "Boa evolução 👏"
        return "Vamos focar essa semana 🚀"
    }

    
    
  return (
    <SafeAreaView className="flex-1 bg-background">

        <FlatList
            data={sortedMeals}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}

            ListHeaderComponent={
                <>
                    {/* HEADER */}
                    <View className="flex-row justify-between items-center mt-4">
                        <View>
                        <Text className="text-gray-400 text-sm">Bem-vindo</Text>
                        <Text className="text-2xl font-bold text-gray-800">
                            {user?.name}
                        </Text>
                        </View>

                        <TouchableOpacity onPress={signOut}>
                        <View className="w-11 h-11 bg-gray-200 rounded-2xl" />
                        </TouchableOpacity>
                    </View>

                    {/* CARD ADERÊNCIA */}
                    <View 
                        className="bg-white mt-6 mb-4 p-6 rounded-3xl shadow-sm"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.06,
                            shadowRadius: 12,
                            elevation: 3,
                        }}
                        >
                        <Text className="text-gray-400 mb-2">Aderência (7 dias)</Text>

                        <Text className="text-4xl font-bold text-green-500">
                            {dashboard?.adherence?.last7Days ?? 0}%
                        </Text>

                        <Text className="text-gray-500 mt-2">
                            {getMotivation(dashboard?.adherence?.last7Days ?? 0)}
                        </Text>
                    </View>

                    <AppCard title="Sequência Atual" icon="local-fire-department">
                        <Text className="text-3xl font-nunito_bold text-orange-500">
                            {currentStreak} {currentStreak === 1 ? "dia" : "dias"}  🔥
                        </Text>

                        <Text className="text-gray-400 mt-1">
                            Dias consecutivos dentro da meta,
                        </Text>
                        <Text className="text-gray-400">
                           nos últimos {period} dias
                        </Text>
                        <Text className="mt-2 text-orange-500">
                            Melhor sequência: {bestStreak} {bestStreak === 1 ? "dia" : "dias"} 
                        </Text>
                    </AppCard>
                    
                    {/* CARD PROGRESSO */}
                    <AppCard title="Progresso de Hoje" icon="insights">
                        <Text className="text-gray-400 mb-2">
                            Refeições registradas
                        </Text>

                        <Text className="text-2xl font-nunito_bold text-gray-1">
                            {dashboard?.today?.completedMealsToday ?? 0} / {dashboard?.today?.totalTodayMeals ?? 0}
                        </Text>

                        <View className="h-2 bg-gray-6 rounded-full mt-3 overflow-hidden">
                            <View
                            className="h-2 bg-green-dark rounded-full"
                            style={{
                                width: `${
                                dashboard?.today?.totalTodayMeals
                                    ? (dashboard.today.completedMealsToday /
                                        dashboard.today.totalTodayMeals) *
                                    100
                                    : 0
                                }%`,
                            }}
                            />
                        </View>

                        <Text className="text-gray-400 mt-4">
                            Calorias
                        </Text>

                        <Text className="text-lg font-nunito_bold text-gray-1">
                            {dashboard?.today?.totalCaloriesConsumed ?? 0} /{" "}
                            {dashboard?.today?.totalCaloriesTarget ?? 0} kcal
                        </Text>

                        <View className="flex-row justify-between w-[70%] mt-4">
                            <View className="items-center">
                                <Text className="text-xs text-gray-400">Proteína</Text>
                                <Text className="font-nunito_bold text-gray-800">
                                {dashboard?.today?.totalProteinConsumed ?? 0}g
                                </Text>
                            </View>

                            <View className="items-center">
                                <Text className="text-xs text-gray-400">Carbo</Text>
                                <Text className="font-nunito_bold text-gray-800">
                                {dashboard?.today?.totalCarbsConsumed ?? 0}g
                                </Text>
                            </View>

                            <View className="items-center">
                                <Text className="text-xs text-gray-400">Gordura</Text>
                                <Text className="font-nunito_bold text-gray-800">
                                {dashboard?.today?.totalFatConsumed ?? 0}g
                                </Text>
                            </View>
                        </View>

                        <Text className="text-gray-400 mt-4">
                            Aderência hoje: 
                        </Text>
                        <Text className={`text-xl font-nunito_bold text-gray-1 ${dashboard?.today?.adherenceToday >= 85 ? "text-green-dark": "text-red-dark"}`}>
                            {dashboard?.today?.adherenceToday ?? 0}%
                        </Text>
                    </AppCard>

                    {/* CARD PROXIMA REFEIÇÃO */}
                    <AppCard title="Próxima refeição" icon="schedule">
                        {nextMeal ? (
                            <>
                                <Text className="text-lg font-nunito_bold text-gray-1">
                                    {nextMeal.name}
                                </Text>

                                <Text className="text-gray-400 mt-1">
                                    {nextMeal.time}
                                </Text>
                                <Text className="text-green-500 mt-2 font-nunito_bold">
                                    Em {formatTimeLeft(minutesLeft)}
                                </Text>
                            </>
                        ) : (
                            <Text className="text-green-500 font-nunito_bold">
                                Todas refeições concluídas hoje 🎉
                            </Text>
                        )}

                    </AppCard>

                    {/* TÍTULO */}
                    <View className="flex-row justify-between items-center mt-8 mb-4">
                        <Text className="text-lg font-semibold text-gray-800">
                        Plano de Hoje
                        </Text>
                    </View>

      
                </>
            }

            renderItem={({ item }) => {

                const status = getMealStatus(item)

                return(
                    <TouchableOpacity
                        className="bg-white p-5 rounded-2xl mb-4 shadow-sm"
                        activeOpacity={0.7}
                        onPress={() =>
                            navigation.navigate("MealForm", {
                                mealPlanItemId: item.id,
                            })
                        }
                    >
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className={`mt-2 text-sm font-nunito_bold ${status.color}`}>
                                    {status.label}
                                </Text>
                                <Text className="text-lg font-semibold text-gray-800">
                                    {item.name}
                                </Text>

                                <Text className="text-gray-400 mt-1">
                                    {item.time}
                                </Text>
                            </View>

                            <Feather name="chevron-right" size={20} color="#ccc" />
                        </View>
                    </TouchableOpacity>

                )
            }}
            ListEmptyComponent={() => (
                <View className="mt-20">
                    <Text className="text-center text-gray-400">
                    Nenhum plano com itens ativo
                    </Text>
                </View>
            )}
        />
      
        {/* BOTÃO FLUTUANTE (Refeição Livre) */}
        <TouchableOpacity
            className="absolute bottom-8 right-6 bg-green-dark w-16 h-16 rounded-full items-center justify-center shadow-lg"
            onPress={() => navigation.navigate("MealForm")}
        >
            <Feather name="plus" size={26} color="white" />
        </TouchableOpacity>
    </SafeAreaView>
  );
}