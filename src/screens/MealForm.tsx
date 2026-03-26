import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import { PatientNavigationProps } from "../routes/patient.routes";
import { PatientStackParamList } from "../@types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { formatInteger } from "../utils/formatInteger";
import { formatDecimal } from "../utils/formatDecimal";
import { getMealPlanItemByIdRequest } from "../services/mealPlanItems";
import dayjs from "../lib/dayjs";

type RouteProps = RouteProp<PatientStackParamList, "MealForm">

export function MealForm() {
    const navigation = useNavigation<PatientNavigationProps>()

    const route = useRoute<RouteProps>()
    const id = route.params?.id
    const mealPlanItemId = route.params?.mealPlanItemId
    const isEditing = !!id

    const [showDatePicker, setShowDatePicker] = useState(false);

    const {control, handleSubmit, setValue, watch, formState: {errors, isSubmitting}} = useForm<MealFormData>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            name: "",
            description: "",
            date: "",
            time: "",
        },
    })

    const {data: mealData, isLoading} = useQuery({
        queryKey: ["meal", id],
        queryFn: () => getMealByIdRequest(id!),
        enabled: isEditing
    })

    const { data: mealPlanItemData } = useQuery({
        queryKey: ["meal-plan-item", mealPlanItemId],
        queryFn: () => getMealPlanItemByIdRequest(mealPlanItemId!),
        enabled: !!mealPlanItemId,
    });
    console.log("MealForm => mealPlanItemData: ", {mealPlanItemData, mealData});
    

    const queryClient = useQueryClient()

    const createMutation = useMutation({
        mutationFn: createMealRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({  queryKey: ["patient-dashboard"]})
        },        
    })

    const updateMutation = useMutation({
        mutationFn: (data: CreateMealDTO) => updateMealRequest(id!, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({  queryKey: ["patient-dashboard"]})
        },  
    })

    async function onSubmit(data: MealFormData) {

        try {
            if(isEditing) {
                await updateMutation.mutateAsync({
                    ...data,
                    description: data.description ?? "",
                })

                Toast.show({
                    type: "success",
                    text1: "Refeição atualizada!",
                });
            } else {
                await createMutation.mutateAsync({
                    ...data, 
                    description: data.description ?? "",
                    mealPlanItemId
                })
                // console.log("MealForm => data: ", data);
                
                Toast.show({
                    type: "success",
                    text1: "Refeição cadastrada!",
                })

            }

            navigation.navigate("Feedback", {
                isOnDiet: data.isOnDiet,
            })

        } catch(error: any) {
            Toast.show({
                type: "error",
                text1: "Erro ao cadastrar refeição",
                text2: error.response.data.message,
                
            })
        }
    }

    useEffect(() => {
        if(mealData){
            setValue("name", mealData.name);
            setValue("description", mealData.description ?? "");
            setValue("isOnDiet", mealData.isOnDiet);

            setValue("date", dayjs(mealData.date).format("DD/MM/YYYY"));
            setValue("time", mealData.time);

            // Pré-preencher metas como referência visual
            setValue("consumedCalories", mealData.consumedCalories ?? 0);
            setValue("consumedProtein", mealData.consumedProtein ?? 0);
            setValue("consumedCarbs", mealData.consumedCarbs ?? 0);
            setValue("consumedFat", mealData.consumedFat ?? 0);
        }
    }, [mealData])

    useEffect(() => {
        if (mealPlanItemData && !isEditing) {
            setValue("name", mealPlanItemData.name);
            setValue("description", mealPlanItemData.description ?? "");

            setValue("time", mealPlanItemData.time);
            setValue("date", dayjs().format("DD/MM/YYYY"), {shouldValidate: true});

            // Pré-preencher metas como referência visual
            setValue("consumedCalories", mealPlanItemData.targetCalories ?? 0);
            setValue("consumedProtein", mealPlanItemData.targetProtein ?? 0);
            setValue("consumedCarbs", mealPlanItemData.targetCarbs ?? 0);
            setValue("consumedFat", mealPlanItemData.targetFat ?? 0);
        }
    }, [mealPlanItemData, isEditing]);

    useEffect(() => {
        if (mealPlanItemId) {
            setValue("isOnDiet", true, {shouldValidate: true});
        }
    }, [mealPlanItemId]);

    return (
        <View className="flex-1 bg-white">
            <HeaderPage variant="neutral" title={isEditing ? "Editar refeição" : "Nova refeição"}/>

            <ScrollView className="flex-1 bg-white rounded-t-3xl px-6 py-6  -mt-4">
                
                <Text className="font-nunito_bold text-base mb-1">Nome</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({field: {value, onChange}})=> (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            editable={!mealPlanItemId}
                            className={`border border-gray-5 rounded-md p-4 ${mealPlanItemId ? "bg-gray-6 text-gray-400" : "bg-white text-gray-1"}`}
                        />
                    )}
                />
                {errors.name && (
                    <Text className="text-red-dark mt-1">{errors.name.message}</Text>
                )}

                <Text className="font-nunito_bold text-base mt-2 mb-1">Descrição</Text>
                <Controller
                    control={control}
                    name="description"
                    render={({field: {value, onChange}})=> (
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            multiline
                            textAlignVertical="top"
                            className="bg-white border border-gray-5 rounded-md p-4 h-24"
                        />
                    )}
                />

                <Text className="font-nunito_bold text-base mt-2 mb-1">Data</Text>
                <TouchableOpacity onPress={()=> setShowDatePicker(true)} className="bg-white border border-gray-5 rounded-md p-4">
                    <Text>{watch("date") || "Selecionar data"}</Text>
                </TouchableOpacity>
                {/*possivel erro: Se quiser, posso também te mostrar um bug muito comum que acontece com React Native + date picker + timezone, 
                que provavelmente vai aparecer no seu app quando usuários registrarem refeições perto da meia-noite. */}
                {showDatePicker && (
                    <DateTimePicker
                        mode="date"
                        value={
                            watch("date") && dayjs(watch("date"), "DD/MM/YYYY", true).isValid()
                            ? dayjs(watch("date"), "DD/MM/YYYY").toDate()
                            : new Date()
                        }
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false)

                            if (selectedDate) {
                            const formatted = dayjs(selectedDate).format("DD/MM/YYYY")
                            setValue("date", formatted)
                            }
                        }}
                    />
                )}
                {errors.date && (
                    <Text className="text-red-dark mt-1">{errors.date.message}</Text>
                )}

                <Text className="font-nunito_bold text-base mt-2 mb-1">Hora</Text>
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
                            className="bg-white border border-gray-5 rounded-md p-4"
                        />
                    )}
                />
                {errors.time && (
                    <Text className="text-red-dark mt-1">{errors.time.message}</Text>
                )}

                <Text className="font-nunito_bold text-base mt-3 mb-1">Está dentro da dieta?</Text>
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

                    {mealPlanItemData && (
                        <View className="bg-green-light p-4 rounded-2xl mt-4 mb-4 border border-green-mid">
                            <Text className="font-bold text-green-dark mb-2">
                            Metas desta refeição
                            </Text>

                            <Text className="text-gray-700">
                            🔥 {mealPlanItemData.targetCalories ?? 0} kcal
                            </Text>
                            <Text className="text-gray-700">
                            💪 {mealPlanItemData.targetProtein ?? 0}g proteína
                            </Text>
                            <Text className="text-gray-700">
                            🍞 {mealPlanItemData.targetCarbs ?? 0}g carbo
                            </Text>
                            <Text className="text-gray-700">
                            🥑 {mealPlanItemData.targetFat ?? 0}g gordura
                            </Text>
                        </View>
                    )}

                    <Text className="text-base font-nunito_bold mt-2 text-gray-700">
                        Consumo Real
                    </Text>
                    <Text className="text-base font-nunito_bold mb-1 mt-2">
                        Calorias
                    </Text>
                    <Controller
                        control={control}
                        name="consumedCalories"
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
                                    value={value !== undefined && value !== null ? String(value) : ""}
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
                        name="consumedProtein"
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
                                value={value !== undefined && value !== null ? String(value) : ""}
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
                        name="consumedCarbs"
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
                                value={value !== undefined && value !== null ? String(value) : ""}
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
                        name="consumedFat"
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
                                value={value !== undefined && value !== null ? String(value) : ""}
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
                
                
                <View className="mt-10 mb-16">
                    <Button 
                        title={isEditing ? updateMutation.isPending ? "Salvando" : "Salvar alterações" : createMutation.isPending ? "Cadastrando" : "Cadastrar refeição"}
                        onPress={handleSubmit(onSubmit)} 
                        isLoading={isSubmitting}
                        disabled={updateMutation.isPending || createMutation.isPending || isSubmitting}
                    />

                </View>

            </ScrollView>
        </View>
    )
}