import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HeaderPage } from "../components/HeaderPage";
import DateTimePicker from "@react-native-community/datetimepicker" 

import {Controller, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { MealFormData, mealSchema } from "./schema/schema";
import { formatHourInput } from "../utils/formatHour";
import { Button } from "../components/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateMealDTO, createMealRequest, getMealByIdRequest, updateMealRequest } from "../services/meals";
import Toast from "react-native-toast-message";
import { buildISODate } from "../utils/buildISODate";
import dayjs from "dayjs";
import { PatientNavigationProps } from "../routes/patient.routes";
import { PatientStackParamList } from "../@types/navigation";

type RouteProps = RouteProp<PatientStackParamList, "MealForm">

export function MealForm() {
    const navigation = useNavigation<PatientNavigationProps>()
    const route = useRoute<RouteProps>()
    const id = route.params?.id
    const isEditing = !!id

    const [showDatePicker, setShowDatePicker] = useState(false);

    const {control, handleSubmit, setValue, watch, formState: {errors, isSubmitting}} = useForm<MealFormData>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            name: "",
            description: "",
            date: "",
            hour: "",
        },
    })

    const {data: mealData, isLoading} = useQuery({
        queryKey: ["meal", id],
        queryFn: () => getMealByIdRequest(id!),
        enabled: isEditing
    })

    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: createMealRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["meals"]})
            await queryClient.invalidateQueries({ queryKey: ["metrics"]})
        },        
    })

    const updateMutation = useMutation({
        mutationFn: (data: CreateMealDTO) => updateMealRequest(id!, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["meals"]})
            await queryClient.invalidateQueries({ queryKey: ["metrics"]})
        },  
    })

    async function onSubmit(data: MealFormData) {
        const isoDate = buildISODate(data.date, data.hour)

        try {
            if(isEditing) {
                await updateMutation.mutateAsync({
                    ...data,
                    date: isoDate,
                    description: data.description ?? ""
                })

                Toast.show({
                    type: "success",
                    text1: "Refeição atualizada!",
                });
            } else {
                await createMutation.mutateAsync({
                    ...data, 
                    date: isoDate, 
                    description: data.description ?? ""
                })
               
                Toast.show({
                    type: "success",
                    text1: "Refeição cadastrada!",
                })

                
       
            }

            navigation.navigate("Feedback", {
             isOnDiet: data.isOnDiet,
            })

        } catch {
            Toast.show({
                type: "error",
                text1: "Erro ao cadastrar refeição",
            })
        }
    }

    useEffect(() => {
        if(mealData){
            setValue("name", mealData.name);
            setValue("description", mealData.description ?? "");
            setValue("isOnDiet", mealData.isOnDiet);

            const date = dayjs(mealData.date);

            setValue("date", date.format("DD/MM/YYYY"));
            setValue("hour", date.format("HH:mm"));
        }
    }, [mealData])

    return (
        <View className="flex-1 bg-white">
            <HeaderPage variant="neutral" title={isEditing ? "Editar refeição" : "Nova refeição"}/>

            <View className="flex-1 bg-white rounded-t-3xl px-6 py-12  -mt-4">
                
                <Text className="font-nunito_bold text-sm mb-2">Nome</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({field: {value, onChange}})=> (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            className="bg-white border border-gray-5 rounded-md p-4"
                        />
                    )}
                />
                {errors.name && (
                    <Text className="text-red-dark mt-1">{errors.name.message}</Text>
                )}

                <Text className="font-nunito_bold text-sm mt-4 mb-2">Descrição</Text>
                <Controller
                    control={control}
                    name="description"
                    render={({field: {value, onChange}})=> (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            multiline
                            textAlignVertical="top"
                            className="bg-white border border-gray-5 rounded-md p-4 h-28"
                        />
                    )}
                />

                <Text className="font-nunito_bold text-sm mt-4 mb-2">Data</Text>
                <TouchableOpacity onPress={()=> setShowDatePicker(true)} className="bg-white border border-gray-5 rounded-md p-4">
                    <Text>{watch("date") || "Selecionar data"}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        mode="date"
                        value={new Date()}
                        onChange={(event, selectedDate)=> {
                            setShowDatePicker(false)
                            if(selectedDate) {
                                const formatted = selectedDate.toLocaleDateString("pt-BR")
                                setValue("date", formatted)
                            }
                        }}
                    />
                )}
                {errors.date && (
                    <Text className="text-red-dark mt-1">{errors.date.message}</Text>
                )}

                <Text className="font-nunito_bold text-sm mt-4 mb-2">Hora</Text>
                <Controller
                    control={control}
                    name="hour"
                    render={({ field: { onChange, value } }) => (
                    <TextInput
                        value={value}
                        onChangeText={(text) => onChange(formatHourInput(text))}
                        keyboardType="numeric"
                        maxLength={5}
                        placeholder="Ex: 12:00"
                        placeholderTextColor={colors.gray[4]}
                        className="bg-white border border-gray-5 rounded-md p-4"
                    />
                    )}
                />
                {errors.hour && (
                    <Text className="text-red-dark mt-1">{errors.hour.message}</Text>
                )}

                <Text className="font-nunito_bold text-sm mt-4 mb-2">Está dentro da dieta?</Text>
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => setValue("isOnDiet", true)}
                        className={`flex-1 flex-row p-4 rounded-md items-center justify-center gap-4
                            ${watch("isOnDiet") ? "bg-green-light border border-green-dark" : "bg-gray-6"}`}
                        >
                        <View className="h-3 w-3 bg-green-dark rounded-full"/>
                        <Text>Sim</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => setValue("isOnDiet", false)}
                        className={`flex-1 flex-row p-4 rounded-md items-center justify-center gap-4
                            ${watch("isOnDiet") === false ? "bg-red-light border border-red-dark" : "bg-gray-6"}`}
                        >
                        <View className="h-3 w-3 bg-red-dark rounded-full"/>
                        <Text>Não</Text>
                    </TouchableOpacity>
                </View>
                
                <View className="mt-auto">
                    <Button 
                        title={isEditing ? updateMutation.isPending ? "Salvando" : "Salvar alterações" : createMutation.isPending ? "Cadastrando" : "Cadastrar refeição"}
                        onPress={handleSubmit(onSubmit)} 
                        disabled={updateMutation.isPending || createMutation.isPending}
                    />

                </View>

            </View>
        </View>
    )
}