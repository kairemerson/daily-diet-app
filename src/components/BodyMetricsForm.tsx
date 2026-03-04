import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'
import { formatWeight } from '../utils/formatWeight'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatInteger } from '../utils/formatInteger'
import DateTimePicker from "@react-native-community/datetimepicker" 
import { Button } from './Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BodyMetrics, createBodyMetricsRequest } from '../services/bodyMetrics'
import Toast from 'react-native-toast-message'


const metricsFormSchema = z.object({
    weight: z.string().optional(),
    bodyFat: z.string().optional(),
    muscleMass: z.string().optional(),
    recordedAt: z.string().optional()
})
.refine((data) => {
  return [data.weight, data.bodyFat, data.muscleMass, data.recordedAt]
    .some((field) => field && field.trim() !== "")
}, {
  message: "Preencha pelo menos um dos campos",
  path: ["_form"],
})

type Props = {
    patientId: string
    closeBottomSheet: () => void
}

type BodyMetricsFormData = z.infer<typeof metricsFormSchema>

export default function BodyMetricsForm({patientId, closeBottomSheet}: Props) {

    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const {control, handleSubmit, watch, setValue, reset,formState: {errors}} = useForm<BodyMetricsFormData>({
        resolver: zodResolver(metricsFormSchema),
          
    })

    const queryClient = useQueryClient()

    const {mutate, isPending} = useMutation({
        mutationFn: createBodyMetricsRequest,
        onSuccess: (newMealPlan) => {
            queryClient.setQueryData<BodyMetrics[]>(
                ["body-metrics", patientId],
                (old) => old ? [newMealPlan, ...old] : [newMealPlan]
            )
            Toast.show({
                type: "success",
                text1: "Métricas adicionadas criado com sucesso!",
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
                text1: "Erro ao salvar métricas!",
                text2: error.response.data.message
            });
        }
    })

    async function onSubmit(data: BodyMetricsFormData) {
        const parsed = {
            ...data,
            weight: data.weight ? Number(data.weight) : undefined,
            bodyFat: data.bodyFat ? Number(data.bodyFat) : undefined,
            muscleMass: data.muscleMass ? Number(data.muscleMass) : undefined
        }

        mutate({patientId, ...parsed})
    }

  return (
    <View className='px-6 py-4'>
      <Text className='text-base text-center font-nunito_bold text-gray-1 mb-6'>Métricas corporais</Text>

        <View className="mb-20">
            {errors._form && (
                <Text className="text-red-500">
                    {errors._form.message}
                </Text>
            )}
            <Text className="text-base font-nunito_bold text-gray-1 mb-1">
                Peso
            </Text>
            <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, value }, fieldState: {error} }) => (
                    <>
                    <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                        <MaterialIcons
                            name="gps-fixed"
                            size={20}
                            color={colors.gray[4]}
                            style={{marginRight: 8}}
                        />
                        <TextInput
                        value={value}
                        onChangeText={(text) => {
                            const masked = formatWeight(text)
                            onChange(masked)
                        }}
                        keyboardType="numeric"
                        placeholder="Ex: 70,50"
                        placeholderTextColor={colors.gray[4]}
                        className="w-full"
                        />
                    </View>
                    </>
                )}
            />

            <Text className="text-base font-nunito_bold mb-1 mt-3">
                Gordura
            </Text>
            <Controller
                control={control}
                name="bodyFat"
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
                            placeholder="Ex: 20"
                            placeholderTextColor={colors.gray[4]}
                            className="w-full"
                        />
                        
                    </View>
                )}
            />

            <Text className="text-base font-nunito_bold mb-1 mt-3">
                Massa muscular
            </Text>
            <Controller
                control={control}
                name="muscleMass"
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
                            placeholder="Ex: 20"
                            placeholderTextColor={colors.gray[4]}
                            className="w-full"
                        />
                        
                    </View>
                )}
            />

            <Text className="text-base font-nunito_bold mb-1 mt-3">
                Data final
            </Text>
            {watch("recordedAt") && (
                <TouchableOpacity
                    onPress={() => setValue("recordedAt", undefined)}
                >
                    <Text className="text-red-500">clique aqui para remover a data</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={()=> setShowDatePicker(true)} className="bg-white border border-gray-5 rounded-md p-4">
                <Text>{watch("recordedAt") ? new Date(watch("recordedAt")!).toLocaleDateString("pt-BR") : "Selecionar data"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    mode="date"
                    value={watch("recordedAt") ? new Date(watch("recordedAt")!) : new Date()}
                    onChange={(event, selectedDate)=> {
                        setShowDatePicker(false)

                        if(event.type === "dismissed") {
                            return
                        }

                        if(selectedDate) {
                            setValue("recordedAt", selectedDate.toISOString(), {
                                shouldValidate: true
                            })
                        }
                    }}
                />
            )}
            {errors.recordedAt && (
                <Text className="text-red-dark mt-1">{errors.recordedAt.message}</Text>
            )}

            <Button title='Salvar' onPress={handleSubmit(onSubmit)} className='mt-8' disabled={isPending}/>
        </View>
    </View>
  )
}

