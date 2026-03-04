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

export function HomePatient() {
    const { signOut } = useAuth();
    const navigation = useNavigation<PatientNavigationProps>();

    const { data: dashboard, isLoading } = useQuery({
        queryKey: ["patient-dashboard"],
        queryFn: getPatientDashboard,
    });

    console.log("HomePatient => dashboard: ", dashboard);
    
    const mealPlanItems = dashboard?.activeMealPlan?.meals ?? [];

    const now = dayjs()

    const nextMeal = mealPlanItems
        .map(meal => ({
            ...meal,
            todayTime: dayjs(meal.time)
            .year(now.year())
            .month(now.month())
            .date(now.date()),
        }))
        .sort((a, b) => a.todayTime.valueOf() - b.todayTime.valueOf())
        .find(meal => meal.todayTime.isAfter(now))  

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
    <SafeAreaView className="flex-1 bg-[#F7F8FC] px-6">
      
        {/* HEADER */}
        <View className="flex-row justify-between items-center mt-4">
            <View>
            <Text className="text-gray-400 text-sm">Bem-vindo</Text>
            <Text className="text-2xl font-bold text-gray-800">
                {dashboard?.patient?.name}
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
        
        {/* CARD PROGRESSO */}
        <AppCard title="Progresso de Hoje" icon="insights">
            <Text className="text-gray-400 mb-2">
                Refeições registradas
            </Text>

            <Text className="text-2xl font-nunito_bold text-gray-1">
                {dashboard?.today?.completedMealsToday ?? 0} / {dashboard?.today?.totalMeals ?? 0}
            </Text>

            <View className="h-2 bg-gray-6 rounded-full mt-3 overflow-hidden">
                <View
                className="h-2 bg-green-500 rounded-full"
                style={{
                    width: `${
                    dashboard?.today?.totalMeals
                        ? (dashboard.today.completedMealsToday /
                            dashboard.today.totalMeals) *
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

            <Text className="text-gray-400 mt-4">
                Aderência hoje: 
            </Text>
            <Text className={`text-xl font-nunito_bold text-gray-1 ${dashboard?.today?.adherenceToday >= 85 ? "text-green-500": "text-red-500"}`}>
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
                        {convertDateToHour(nextMeal.time)}
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

      {/* LISTA MEAL PLAN ITEMS */}
      <FlatList
        data={mealPlanItems.sort((a: any, b: any) => a.order - b.order)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
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
                                {convertDateToHour(item.time)}
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
              Nenhum plano ativo
            </Text>
          </View>
        )}
      />

      {/* BOTÃO FLUTUANTE (Refeição Livre) */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-green-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("MealForm")}
      >
        <Feather name="plus" size={26} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}