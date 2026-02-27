import { View, Text, ScrollView } from "react-native";
import {  useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import AppInput from "../components/AppInput";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { createNutritionistProfileRequest } from "../services/nutritionist";
import Toast from "react-native-toast-message";
import { useAuth } from "../contexts/AuthContext";

const nutritionistProfileSchema = z.object({
    crn: z.string("O CRN é obrigatorio"),
    specialty: z.string().optional(),
    clinic: z.string().optional(),
    phone: z.string().optional()
})

type NutritionistProfileData = z.infer<typeof nutritionistProfileSchema>

export function NutritionistProfile() {
    const {signOut} = useAuth()

    const navigation = useNavigation()

  const {control, handleSubmit} = useForm<NutritionistProfileData>({
    resolver: zodResolver(nutritionistProfileSchema),
    defaultValues: {
      crn: "",
      clinic: "",
      phone: "",
      specialty: ""
    }
  })

  const {mutate, isPending} = useMutation({
    mutationFn: createNutritionistProfileRequest,
    onSuccess: () => {
        Toast.show({
            type: "success",
            text1: "Perfil atualizado com sucesso",
        });
        navigation.goBack()
    },
    onError: (error: any) => {
        
        Toast.show({
          type: "error",
          text1: "Erro ao atualizar perfil",
        });
    }
  })

  async function onSubmit(data: NutritionistProfileData) {
    mutate(data)
  }

  return (
    <SafeAreaView className="bg-white flex-1 px-6 pt-4 pb-10">
      <ScrollView className="" showsVerticalScrollIndicator={false}>
    
          <Text className="text-lg text-center font-nunito_bold mb-6">
            Perfil
          </Text>


          {/* <Text className="text-lg text-gray-3 font-nunito_regular mb-3">Acesso</Text> */}
          <View className="">
            {/* <AppInput 
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
            /> */}

            <Text className="text-lg text-gray-3 font-nunito_regular mt-6 mb-4">Informações de perfil</Text>
            
            <AppInput
              name="crn"
              control={control}
              label="CRN"
              placeholder="Digite o número do CRN"
              icon="edit"
            />

            <AppInput
              name="specialty"
              control={control}
              label="Especialidade"
              placeholder="Digite a sua especialidade"
              icon="edit"
            />

            <AppInput
              name="clinic"
              control={control}
              label="Clínica"
              placeholder="Digite o nome da clínica"
              icon="edit"
            />

            <AppInput
              name="phone"
              control={control}
              label="Telefone"
              placeholder="Digite o telefone"
              icon="phone"
            />

          </View>

          <View className="gap-3 mt-6">
            <Button title="Salvar" onPress={handleSubmit(onSubmit)} disabled={isPending}/>
            <Button title="Voltar" variant="secondary" onPress={() => navigation.goBack()}/>
            
          </View>
          <Button title="Sair" onPress={signOut}/>
      </ScrollView>
    </SafeAreaView>
  );
}