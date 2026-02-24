import { ActivityIndicator, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HeaderPage } from '../components/HeaderPage'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../@types/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMealRequest, getMealByIdRequest } from '../services/meals';
import dayjs from 'dayjs';
import { Button } from '../components/Button';
import { AppNavigationProps } from '../routes/app.routes';
import { ConfirmModal } from '../components/ConfirmModal';
import Toast from 'react-native-toast-message';

type RouteProps = RouteProp<AppStackParamList, "MealDetails">;


export default function MealDetails() {
    const [modalVisible, setModalVisible] = useState(false)

    const navigation = useNavigation<AppNavigationProps>()
    const route = useRoute<RouteProps>()
    const {id} = route.params

    const queryClient = useQueryClient()

    const {data: meal, isLoading} = useQuery({
        queryKey: ["meal", id],
        queryFn: () => getMealByIdRequest(id)
    })

    const {mutateAsync, isPending} = useMutation({
        mutationFn: deleteMealRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["meals"] });
            await queryClient.invalidateQueries({ queryKey: ["metrics"] });

            navigation.navigate("Home");
        }
    })

    function handleDelete() {
        setModalVisible(true);
    }

    async function confirmDelete() {
        if(!meal?.id) return

        setModalVisible(false);
        try {
            await mutateAsync(meal?.id)

            Toast.show({
                type: "success",
                text1: "Refeição excluída com sucesso!",
            });

        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao excluir refeição!",
            });
        }
        
        
    }
    

    if(isLoading) return <ActivityIndicator/>
    
    
  return (
    <View className='flex-1'>
        <HeaderPage variant={meal?.isOnDiet ? "primary" : "secondary"} title='Refeição'/>

        <View className='flex-1 bg-white text-gray-1 rounded-t-3xl px-6 py-12 -mt-4'>
            <Text className='font-nunito_bold text-xl mb-2'>{meal?.name}</Text>

            {meal?.description && (
                <Text className='font-nunito_regular text-base text-gray-2 mb-10'>{meal.description}</Text>

            )}

            <Text className='font-nunito_bold text-gray-1 text-sm mb-2'>Data e hora</Text>
            <Text className='font-nunito_regular text-base text-gray-2 mb-10'>{dayjs(meal?.date).format("DD/MM/YYYY") + " "}às{" " + dayjs(meal?.date).format("HH:mm")}</Text>

            <View className='flex-row bg-gray-6 items-center justify-center w-[144] gap-2 px-4 py-2 rounded-full'>
                <View className={`h-3 w-3 rounded-full ${meal?.isOnDiet ? "bg-green-dark" : "bg-red-dark"}`}/>
                <Text className='text-gray-1 text-sm'>{meal?.isOnDiet ? "dentro da dieta" : "fora da dieta"}</Text>
            </View>

        </View>

        <View className='px-6 py-12 bg-white gap-4'>
            <Button title='Editar refeição' iconName='edit-note' onPress={() => navigation.navigate("MealForm", {id})} disabled={isPending}/>
            <Button title='Excluir refeição' iconName='delete-outline' variant='secondary' onPress={handleDelete} disabled={isPending}/>
        </View>

        <ConfirmModal
            visible={modalVisible}
            title='Deseja realmente excluir o registro da refeição?'
            onCancel={() => setModalVisible(false)}
            onConfirm={confirmDelete}
            confirmText='Sim, excluir'
        />
        
    </View>
  )
}

