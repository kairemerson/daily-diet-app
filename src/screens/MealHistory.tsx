import { useQuery } from "@tanstack/react-query"
import { SectionList, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MealHistoryCard } from "../components/MealHistoryCard"
import { getMealsByPatientIdRequest, getMealsRequest } from "../services/meals"
import { RouteProp, useRoute } from "@react-navigation/native"
import { AdminStackParamList } from "../@types/navigation"
import dayjs from "dayjs"
import { Header } from "../components/Header"
import { HeaderPage } from "../components/HeaderPage"

type RouteProps = RouteProp<AdminStackParamList, "MealHistory">

export function MealHistory() {

    const route = useRoute<RouteProps>()
    const {patientId} = route.params

    const { data: meals=[] } = useQuery({
        queryKey: ["patient-meals"],
        queryFn: () => getMealsByPatientIdRequest(patientId),
        enabled: !!patientId
    })

    // console.log("MealHistory => meals", meals[0].data);
    
    return (
        <View className="flex-1 bg-gray-7">
            <HeaderPage title="Histórico de refeições"/>

            <SectionList
                sections={meals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MealHistoryCard meal={item} />
                )}
                renderSectionHeader={({section: {title}}) => (
                    <Header title={dayjs(title).format("DD/MM/YYYY")}/>
                )}
                ListEmptyComponent={() => (
                    <View className="mt-20">
                    <Text className="text-center text-gray-3 font-nunito_regular">Nenhum item na lista, paciente ainda não adicionou refeição!</Text>
                    </View>
                )}
                contentContainerStyle={{paddingHorizontal: 18}}
            />

        </View>
    )
}