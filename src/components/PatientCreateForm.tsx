import { View, Text, ScrollView, TextInput } from "react-native";
import AppInput from "./AppInput";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { RadioGroup } from "./RadioGroup";
import { useMutation } from "@tanstack/react-query";
import { createPatient } from "../services/patients";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { formatHeight } from "../utils/formatHeight";
import { formatDate } from "../utils/formatDate";
import { formatWeight } from "../utils/formatWeight";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const patientCreateFormSchema = z.object({
  name: z.string("Infome seu nome!").min(3, "O nome precisa ter pelo menos 3 caracteres!"),
  email: z.email("Infome um email válido!"),
  password: z.string("Informe a senha!").min(6, "A senha deve ter pelo menos 6 caracteres!"),
  goal: z.enum([
    "WEIGHT_LOSS",
    "HYPERTROPHY",
    "REEDUCATION",
    "MAINTENANCE"
  ], "Marque uma das opções"),
  birthDate: z.string().optional(),
  height: z.string().optional(),
  targetWeight: z.string().optional(),
  observation: z.string().optional()
})

type PatientCreateFormData = z.infer<typeof patientCreateFormSchema>

export function PatientCreateForm() {

    const navigation = useNavigation()

    const {control, handleSubmit} = useForm<PatientCreateFormData>({
      resolver: zodResolver(patientCreateFormSchema),
      defaultValues: {
        goal: "WEIGHT_LOSS",
        birthDate: "",
        height: "",
        targetWeight: "",
        observation: ""
      }
    })

  const {mutate, isPending} = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      Toast.show({
          type: "success",
          text1: "Paciente criado com sucesso!",
      });
      navigation.goBack()
    },
    onError: (error: any) => {
      
        Toast.show({
          type: "error",
          text1: "Erro ao criar paciente!",
          text2: error.response.data.message
        });
    }
  })

  async function onSubmit(data: PatientCreateFormData) {
    const formattedData = {
      ...data,
      birthDate: data.birthDate
        ? (() => {
            const [day, month, year] = data.birthDate.split("/")
            return new Date(`${year}-${month}-${day}`).toISOString()
          })()
        : undefined,

      height: data.height
        ? Number(data.height.replace(",", "."))
        : undefined,

      targetWeight: data.targetWeight
        ? Number(data.targetWeight.replace(",", "."))
        : undefined,
    }

    mutate(formattedData)
  }

  return (
    <SafeAreaView className="bg-white flex-1 px-6 pt-4 pb-10">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
    
          <Text className="text-lg text-center font-nunito_bold mb-6">
            Adicionar paciente
          </Text>


          <Text className="text-lg text-gray-3 font-nunito_regular mb-3">Acesso</Text>
          <View className="">
            <AppInput 
              control={control}
              name="name"
              label="Nome"
              placeholder="Digite seu nome"
              icon="person-outline"
            />

            <AppInput
              name="email"
              control={control}
              label="E-mail"
              placeholder="Digite seu e-mail"
              icon="mail-outline"
              keyboardType="email-address"
            />

            <AppInput
              name="password"
              control={control}
              label="Senha"
              placeholder="Digite a senha"
              icon="lock-outline"
              secureTextEntry
            />

            <Text className="text-lg text-gray-3 font-nunito_regular mt-6 mb-4">Informações do paciente</Text>

            <View className="mb-5">
              <Text className="text-base font-nunito_bold mt-6 mb-2">
                Objetivo
              </Text>

              <View className="w-[80%]">
                <Controller
                  control={control}
                  name="goal"
                  render={({ field: { onChange, value }, fieldState: {error} }) => (
                    <>
                      <RadioGroup
                        value={value}
                        onChange={onChange}
                        options={[
                          { label: "Emagrecimento", value: "WEIGHT_LOSS" },
                          { label: "Hipertrofia", value: "HYPERTROPHY" },
                          { label: "Reeducação alimentar", value: "REEDUCATION" },
                          { label: "Manutenção", value: "MAINTENANCE" },
                        ]}
                      />
                      {error && (
                          <Text className='text-red-dark text-xs mt-1'>
                              {error.message}
                          </Text>
                      )}

                    </>
                  )}
                />
                

              </View>
              
            </View>
            
            <View className="mb-4">
              <Text className="text-base font-nunito_bold text-gray-1 mb-1">
                Data de nascimento
              </Text>

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value }, fieldState: {error} }) => (
                  <>
                    <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                      <MaterialIcons
                            name="calendar-month"
                            size={20}
                            color={colors.gray[4]}
                            style={{marginRight: 8}}
                        />
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          const masked = formatDate(text)
                          onChange(masked)
                        }}
                        keyboardType="numeric"
                        placeholder="Ex: 99/99/9999"
                        placeholderTextColor={colors.gray[4]}
                        className="w-full"
                      />
                    </View>
                  
                  </>
                )}
              />

            </View>

            <View className="mb-4">
              <Text className="text-base font-nunito_bold text-gray-1 mb-1">
                Altura
              </Text>
              <Controller
                control={control}
                name="height"
                render={({ field: { onChange, value }, fieldState: {error} }) => (
                  <>
                      <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                          <MaterialIcons
                              name="expand"
                              size={20}
                              color={colors.gray[4]}
                              style={{marginRight: 8}}
                          />
                          <TextInput
                            value={value}
                            onChangeText={(text) => {
                              const masked = formatHeight(text)
                              onChange(masked)
                            }}
                            keyboardType="numeric"
                            placeholder="Ex: 1,75"
                            placeholderTextColor={colors.gray[4]}
                            className="w-full"
                          />
                      </View>
                  </>
                )}
              />
            </View>

            <View className="mb-4">
              <Text className="text-base font-nunito_bold text-gray-1 mb-1">
                Peso alvo
              </Text>
              <Controller
                control={control}
                name="targetWeight"
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
            </View>

            <AppInput
              name="observation"
              control={control}
              label="Observação"
              placeholder="Digite uma observação"
              icon="edit-note"
              multiline
              className="w-full h-28"
            />

          </View>

          <View className="gap-3">
            <Button title="Salvar" onPress={handleSubmit(onSubmit)} disabled={isPending}/>
            <Button title="Cancelar" variant="secondary"/>
          </View>
          
      </ScrollView>
    </SafeAreaView>
  );
}