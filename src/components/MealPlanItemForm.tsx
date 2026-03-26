import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { createMealPanItem } from '../services/mealPlanItems'
import Toast from 'react-native-toast-message'
import AppInput from './AppInput'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'
import { formatInteger } from '../utils/formatInteger'
import { formatDecimal } from '../utils/formatDecimal'
import { Button } from './Button'
import { formatHourInput } from '../utils/formatHour'
import { AppSelect } from './AppSelect'
import { convertHourToDate } from '../utils/convertHourToDate'


const mealPlanItemFormSchema = z.object({
    name: z.string("O nome é obrigatório.").min(2, "O nome tem que ter pelo menos duas letras."),
    description: z.string().optional(),
    order: z.number("Posição do item obrigatório.").min(1),
    time: z.string("A hora é obrigatória."),
    targetCalories: z.string().optional(),
    targetProtein: z.string().optional(),
    targetCarbs: z.string().optional(),
    targetFat: z.string().optional(),
})

type MealPlanItemFormData = z.infer<typeof mealPlanItemFormSchema>

type Props = {
    mealPlanId: string,
    closeBottomSheet: () => void
}

export function MealPlanItemForm({mealPlanId, closeBottomSheet}: Props) {

    const {control, handleSubmit, watch, setValue, reset, formState: {errors}} = useForm<MealPlanItemFormData>({
        resolver: zodResolver(mealPlanItemFormSchema),
        
    })

    const {mutate, isPending} = useMutation({
        mutationFn: createMealPanItem,
        onSuccess: (newMealPlan) => {
            // queryClient.setQueryData<BodyMetrics[]>(
            //     ["body-metrics", patientId],
            //     (old) => old ? [newMealPlan, ...old] : [newMealPlan]
            // )
            Toast.show({
                type: "success",
                text1: "Item adicionado com sucesso!",
            });
            reset()
            closeBottomSheet()

        },
        onError: (error: any) => {
            console.log("Error", error);
            console.log("Error", error.response);
            console.log("Error", error.response.data);
                
            Toast.show({
                type: "error",
                text1: "Erro ao salvar Item!",
                text2: error.response.data.message
            });
        }
    })

    async function onSubmit(data: MealPlanItemFormData) {
        const parsed = {
            ...data,
            order: Number(data.order),
            time: data.time,
            targetCalories: data.targetCalories ? Number(data.targetCalories) : undefined,
            targetProtein: data.targetProtein ? Number(data.targetProtein) : undefined,
            targetCarbs: data.targetCarbs ? Number(data.targetCarbs) : undefined,
            targetFat: data.targetFat ? Number(data.targetFat) : undefined
        }

        // console.log("MealplanItemForm => data: ", parsed);
        
        mutate({mealPlanId, ...parsed})
    }

  return (
    <View className='px-6 py-4'>
        <Text className='text-base text-center font-nunito_bold text-gray-1 mb-2'>
            Adicionar Itens do plano alimentar
        </Text>

        <View className='mb-10 mt-2'>
             <AppInput 
                control={control}
                name="name"
                label="Nome"
                placeholder="Digite o nome"
                icon="person-outline"
            />

            <AppInput
                name="description"
                control={control}
                label="Descrição"
                placeholder="Digite uma descrição"
                icon="edit-note"
                multiline
                className="w-[95%] h-20"
            />

            <AppSelect 
                control={control}
                name="order"
                label="Posição do item"
                items={[
                    {label: "CAFÉ DA MANHÃ", value: 1},
                    {label: "LANCHE MANHÃ", value: 2},
                    {label: "ALMOÇO", value: 3},
                    {label: "LANCHE TARDE", value: 4},
                    {label: "JANTA", value: 5},
                    {label: "CEIA", value: 6},
                ]}
                error={errors.order?.message}
            />

            <Text className="font-nunito_bold text-sm mb-1">Hora</Text>
            <Controller
                control={control}
                name="time"
                render={({ field: { onChange, value } }) => (
                <TextInput
                    value={value}
                    onChangeText={(text) => onChange(formatHourInput(text))}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholder="Ex: 12:00"
                    placeholderTextColor={colors.gray[4]}
                    className="bg-white border border-gray-5 rounded-md p-4 z-10"
                />
                )}
            />
            {errors.time && (
                <Text className="text-red-dark text-xs mt-1">{errors.time.message}</Text>
            )}

            <Text className="text-base font-nunito_bold mb-1 mt-2">
                Calorias
            </Text>
            <Controller
                control={control}
                name="targetCalories"
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

            <Text className="text-base font-nunito_bold mb-1 mt-2">
                Proteinas
            </Text>
            <Controller
                control={control}
                name="targetProtein"
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

            <Text className="text-base font-nunito_bold mb-1 mt-2">
                Carboidratos
            </Text>
            <Controller
                control={control}
                name="targetCarbs"
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

            <Text className="text-base font-nunito_bold mb-1 mt-2">
                Gordura
            </Text>
            <Controller
                control={control}
                name="targetFat"
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

            <Button title='Salvar item' className='mt-3' onPress={handleSubmit(onSubmit)}/>
        </View>

    </View>
  )
}

