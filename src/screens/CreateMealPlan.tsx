import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { HeaderPage } from '../components/HeaderPage'
import AppInput from '../components/AppInput'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'
import { formatDecimal } from '../utils/formatDecimal'
import { formatInteger } from '../utils/formatInteger'
import { formatDate } from '../utils/formatDate'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMealPlanRequest, MealPlan } from '../services/mealPlan'
import { Button } from '../components/Button'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AdminStackParamList } from '../@types/navigation'
import { AdminNavigationProps } from '../routes/admin.routes'
import DateTimePicker from "@react-native-community/datetimepicker" 
import Toast from 'react-native-toast-message'
import dayjs from 'dayjs'

const createMealPlanFormSchema = z.object({
    title: z.string("Infome o nome do plano!").min(3, "O nome precisa ter pelo menos 3 caracteres!"),
    description: z.string().optional(),
    caloriesTarget: z.string().optional(),
    proteinTarget: z.string().optional(),
    carbsTarget: z.string().optional(),
    fatTarget: z.string().optional(),
    startDate: z.string("A data inicial é obrigatória!"),
    endDate: z.string().optional(),
}).refine((data) => {
    if(!data.endDate) return true

    return new Date(data.endDate) > new Date(data.startDate)
}, {
    message: "Data final deve ser maior que a data inicial",
    path: ["endDate"]
})

type CreateMealPlanFormData = z.infer<typeof createMealPlanFormSchema>

type RouteProps = RouteProp<AdminStackParamList, "CreateMealPlan">


export default function CreateMealPlan() {

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    
    const navigation = useNavigation<AdminNavigationProps>()

    const route = useRoute<RouteProps>()
    const {patientId} = route.params

    const {control, handleSubmit, setValue, watch, formState: {errors}} = useForm<CreateMealPlanFormData>({
        resolver: zodResolver(createMealPlanFormSchema),
        defaultValues: {
            title: "",
            description: "",
            caloriesTarget: "",
            proteinTarget: "",
            carbsTarget: "",
            fatTarget: "",
        }
    })

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: createMealPlanRequest,
        onSuccess: (newMealPlan) => {
            queryClient.setQueryData<MealPlan[]>(
                ["meal-plans", patientId],
                (old) => old ? [newMealPlan, ...old] : [newMealPlan]
            )
            Toast.show({
                type: "success",
                text1: "Plano alimentar criado com sucesso!",
            });
            navigation.goBack()
        },
        onError: (error: any) => {
            console.log("Error", error);
            console.log("Error", error.response);
            console.log("Error", error.response.data);
              
            Toast.show({
                type: "error",
                text1: "Erro ao criar plano alimentar!",
                text2: error.response.data.message
            });
        }
    })

    async function onSubmit(data: CreateMealPlanFormData) {
        const parsed = {
            ...data,
            description: data.description || undefined,
            caloriesTarget: data.caloriesTarget
                ? Number(data.caloriesTarget)
                : undefined,
            proteinTarget: data.proteinTarget
                ? Number(data.proteinTarget)
                : undefined,
            carbsTarget: data.carbsTarget
                ? Number(data.carbsTarget)
                : undefined,
            fatTarget: data.fatTarget
                ? Number(data.fatTarget)
                : undefined,
        }

        console.log("CreateMealPLan = data: ", {patientId, ...parsed});
        
        mutate({patientId, ...parsed})
    }

  return (
    <View className='flex-1 bg-gray-7'>
        <HeaderPage title='Plano alimentar'/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="px-6 pt-6 "
        >

            <View className='mb-16'>
                 <AppInput 
                    control={control}
                    name="title"
                    label="Nome"
                    placeholder="Digite seu nome"
                    icon="person-outline"
                />

                 <AppInput
                    name="description"
                    control={control}
                    label="Descrição"
                    placeholder="Digite uma descrição"
                    icon="edit-note"
                    multiline
                    className="w-full h-20"
                />

                <Text className="text-base font-nunito_bold mb-2">
                    Calorias
                </Text>
                <Controller
                    control={control}
                    name="caloriesTarget"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <View
                            className={`flex-row items-center bg-white rounded-md px-3 border ${
                                error ? "border-red-dark" : "border-gray-5"
                            }`}
                            >
                            <MaterialIcons
                                name="local-fire-department"
                                size={20}
                                color={colors.gray[4]}
                                style={{ marginRight: 8 }}
                            />

                            <TextInput
                                value={value ? String(value) : ""}
                                onChangeText={(text) => {
                                const formatted = formatInteger(text)
                                    onChange(formatted)
                                }}
                                keyboardType="numeric"
                                placeholder="Ex: 2200"
                                placeholderTextColor={colors.gray[4]}
                                className="w-full"
                            />
                            
                        </View>
                    )}
                />


                <Text className="text-base font-nunito_bold mb-2 mt-2">
                    Proteinas
                </Text>
                <Controller
                    control={control}
                    name="proteinTarget"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <View
                        className={`flex-row items-center bg-white rounded-md px-3 border ${
                            error ? "border-red-dark" : "border-gray-5"
                        }`}
                        >
                        <MaterialIcons
                            name="fitness-center"
                            size={20}
                            color={colors.gray[4]}
                            style={{ marginRight: 8 }}
                        />

                        <TextInput
                            value={value ? String(value) : ""}
                            onChangeText={(text) => {
                            const formatted = formatDecimal(text)
                            onChange(formatted)
                            }}
                            keyboardType="numeric"
                            placeholder="Ex: 150.5"
                            placeholderTextColor={colors.gray[4]}
                            className="w-full"
                        />
                        </View>
                    )}
                />

                <Text className="text-base font-nunito_bold mb-2 mt-2">
                    Carboidratos
                </Text>
                <Controller
                    control={control}
                    name="carbsTarget"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <View
                        className={`flex-row items-center bg-white rounded-md px-3 border ${
                            error ? "border-red-dark" : "border-gray-5"
                        }`}
                        >
                        <MaterialIcons
                            name="fitness-center"
                            size={20}
                            color={colors.gray[4]}
                            style={{ marginRight: 8 }}
                        />

                        <TextInput
                            value={value ? String(value) : ""}
                            onChangeText={(text) => {
                            const formatted = formatDecimal(text)
                            onChange(formatted)
                            }}
                            keyboardType="numeric"
                            placeholder="Ex: 150.5"
                            placeholderTextColor={colors.gray[4]}
                            className="w-full"
                        />
                        </View>
                    )}
                />

                <Text className="text-base font-nunito_bold mb-2 mt-2">
                    Gordura
                </Text>
                <Controller
                    control={control}
                    name="fatTarget"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <View
                        className={`flex-row items-center bg-white rounded-md px-3 border ${
                            error ? "border-red-dark" : "border-gray-5"
                        }`}
                        >
                        <MaterialIcons
                            name="fitness-center"
                            size={20}
                            color={colors.gray[4]}
                            style={{ marginRight: 8 }}
                        />

                        <TextInput
                            value={value ? String(value) : ""}
                            onChangeText={(text) => {
                            const formatted = formatDecimal(text)
                            onChange(formatted)
                            }}
                            keyboardType="numeric"
                            placeholder="Ex: 150.5"
                            placeholderTextColor={colors.gray[4]}
                            className="w-full"
                        />
                        </View>
                    )}
                />

                <Text className="text-base font-nunito_bold mb-2 mt-2">
                    Data inicio
                </Text>
                

                <TouchableOpacity onPress={()=> setShowStartDatePicker(true)} className="bg-white border border-gray-5 rounded-md p-4">
                    <Text>{watch("startDate") ? new Date(watch("startDate")).toLocaleDateString("pt-BR") : "Selecionar data"}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                    <DateTimePicker
                        mode="date"
                        value={watch("startDate") ? new Date(watch("startDate")) : new Date()}
                        onChange={(event, selectedDate)=> {
                            setShowStartDatePicker(false)
                            if(selectedDate) {
                                setValue("startDate", selectedDate.toISOString())
                            }
                        }}
                    />
                )}
                {errors.startDate && (
                    <Text className="text-red-dark mt-1">{errors.startDate.message}</Text>
                )}

                <Text className="text-base font-nunito_bold mb-2 mt-2">
                    Data final
                </Text>
                {watch("endDate") && (
                    <TouchableOpacity
                        onPress={() => setValue("endDate", undefined)}
                    >
                        <Text className="text-red-500">clique aqui para remover data final</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={()=> setShowEndDatePicker(true)} className="bg-white border border-gray-5 rounded-md p-4">
                    <Text>{watch("endDate") ? new Date(watch("endDate")!).toLocaleDateString("pt-BR") : "Selecionar data"}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                    <DateTimePicker
                        mode="date"
                        value={watch("endDate") ? new Date(watch("endDate")!) : new Date()}
                        onChange={(event, selectedDate)=> {
                            setShowEndDatePicker(false)

                            if(event.type === "dismissed") {
                                return
                            }

                            if(selectedDate) {
                                setValue("endDate", selectedDate.toISOString(), {
                                    shouldValidate: true
                                })
                            }
                        }}
                    />
                )}
                {errors.endDate && (
                    <Text className="text-red-dark mt-1">{errors.endDate.message}</Text>
                )}
                

                <Button title='Salvar' className='mt-8' onPress={handleSubmit(onSubmit)}/>
            </View>

        </ScrollView>

    </View>

  )
}

