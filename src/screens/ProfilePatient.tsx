import { useEffect } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfilePatientRequest, updatePatient } from "../services/patients";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { formatHeight } from "../utils/formatHeight";
import { formatDate } from "../utils/formatDate";
import { formatWeight } from "../utils/formatWeight";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { HeaderPage } from "../components/HeaderPage";
import AppInput from "../components/AppInput";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";

const profilePatientFormSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres!").trim(),
  email: z.string().email("Informe um e-mail válido!"),
  birthDate: z.string().optional(),
  height: z.string().optional(),
  targetWeight: z.string().optional(),
});

export type ProfilePatientFormData = z.infer<typeof profilePatientFormSchema>;

export function ProfilePatient() {

  const {user, updateUser, signOut} = useAuth()
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {data: profilePatient, isLoading} = useQuery({
    queryKey: ["profile-patient"],
    queryFn: getProfilePatientRequest
  })
  // console.log("ProfilePatient: profilePatient => ", profilePatient);

  const { control, handleSubmit, reset } = useForm<ProfilePatientFormData>({
    resolver: zodResolver(profilePatientFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      birthDate: profilePatient?.birthDate ? dayjs(profilePatient.birthDate).format("DD/MM/YYYY") : "",
      height: profilePatient?.height ? String(profilePatient.height) : "",
      targetWeight: profilePatient?.targetWeight ? String(profilePatient.targetWeight) : "",
    },
  });


  // Atualiza os campos do form quando os dados iniciais mudarem (carregamento assíncrono)
  useEffect(() => {
    if (profilePatient || user) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        birthDate: profilePatient?.birthDate
          ? dayjs(profilePatient.birthDate).format("DD/MM/YYYY")
          : "",
        height: profilePatient?.height ? String(profilePatient.height) : "",
        targetWeight: profilePatient?.targetWeight ? String(profilePatient.targetWeight) : "",
      });
    }
  }, [profilePatient, user, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => updatePatient(data),
    onSuccess: async (data: any) => {
      if(data?.user) {
        await updateUser(data.user)
      }
      
      Toast.show({
        type: "success",
        text1: "Perfil atualizado com sucesso!",
      });
      await queryClient.invalidateQueries({ queryKey: ["patients"], refetchType: "all" });
      await queryClient.invalidateQueries({ queryKey: ["profile-patient"], refetchType: "all" });

      navigation.goBack();
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar perfil!",
        text2: error?.response?.data?.message || "Tente novamente mais tarde."
      });

      console.log(error?.response.data.issues);
      
    }
  });

  async function onSubmit(data: ProfilePatientFormData) {
    
    const formattedData = {
      ...data,
      birthDate: data.birthDate
        ? (() => {
            const [day, month, year] = data.birthDate.split("/");
            return year && month && day ? new Date(`${year}-${month}-${day}`).toISOString() : undefined;
          })()
        : undefined,

      height: data.height
        ? Number(data.height.replace(",", "."))
        : undefined,

      targetWeight: data.targetWeight
        ? Number(data.targetWeight.replace(",", "."))
        : undefined,
    };

    mutate(formattedData);
  }

  return (
    <View className="flex-1 bg-white">
      <HeaderPage title="Perfil do paciente" />
      
      <View className="flex-1 bg-gray-7 rounded-t-3xl -mt-3">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">

          <Text className="text-lg text-gray-3 font-nunito_regular mb-3 mt-4">
            Dados Pessoais
          </Text>

          <View>
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
              editable={false}
            />

            <Text className="text-lg text-gray-3 font-nunito_regular mt-6 mb-4">
              Informações do paciente
            </Text>

            <View className="mb-4">
              <Text className="text-base font-nunito_bold text-gray-1 mb-1">
                Data de nascimento
              </Text>

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                      <MaterialIcons
                        name="calendar-month"
                        size={20}
                        color={colors.gray[4]}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          const masked = formatDate(text);
                          onChange(masked);
                        }}
                        keyboardType="numeric"
                        placeholder="Ex: 99/99/9999"
                        placeholderTextColor={colors.gray[4]}
                        className="w-full text-gray-3"
                      />
                    </View>
                    {error && (
                      <Text className="text-red-dark text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
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
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                      <MaterialIcons
                        name="expand"
                        size={20}
                        color={colors.gray[4]}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          const masked = formatHeight(text);
                          onChange(masked);
                        }}
                        keyboardType="numeric"
                        placeholder="Ex: 1,75"
                        placeholderTextColor={colors.gray[4]}
                        className="w-full text-gray-3"
                      />
                    </View>
                    {error && (
                      <Text className="text-red-dark text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
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
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <>
                    <View className={`flex-row items-center bg-white rounded-md px-3 border ${error ? "border-red-dark" : "border-gray-5"}`}>
                      <MaterialIcons
                        name="gps-fixed"
                        size={20}
                        color={colors.gray[4]}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          const masked = formatWeight(text);
                          onChange(masked);
                        }}
                        keyboardType="numeric"
                        placeholder="Ex: 70,50"
                        placeholderTextColor={colors.gray[4]}
                        className="w-full text-gray-3"
                      />
                    </View>
                    {error && (
                      <Text className="text-red-dark text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

          </View>

          <View className="gap-3 mb-16 mt-6">
            <Button title="Salvar alterações" onPress={handleSubmit(onSubmit)} disabled={isPending} />
            <Button title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} />
          </View>

          <Button title="Sair" onPress={signOut} className="mb-10"/>

        </ScrollView>
      </View>
    </View>
  );
}