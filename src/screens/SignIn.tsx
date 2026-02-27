import { View, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormData, signInSchema } from "./schema/signInSchema";
import AppInput from "../components/AppInput";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProps } from "../routes/auth.routes";
import { useMutation } from "@tanstack/react-query";
import { signInRequest } from "../services/auth";
import Toast from "react-native-toast-message";

export function SignIn() {
  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigationProps>()

  const {control, handleSubmit} = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  const {mutate, isPending} = useMutation({
    mutationFn: signInRequest,
    onSuccess: (data) => {
      signIn(data.user, data.token)

      Toast.show({
        type: "success",
        text1: "Login realizado",
        text2: "Bem-vindo de volta 👋",
      });
    },
    onError: () => {
      Toast.show({
      type: "error",
      text1: "Erro ao entrar",
      text2: "Email ou senha inválidos",
    });
    }
  })

  async function onSubmit(data: any) {
    mutate(data)
  }

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <Text className="text-gray-1 text-xl text-center mb-20 mt-20 font-nunito_bold">
        Acesse sua conta
      </Text>

      <View className="mb-10"> 
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

      </View>

      <Button title="Entrar" onPress={handleSubmit(onSubmit)} disabled={isPending}/>

      <Text className="text-center text-gray-3 text-base mt-10 mb-2">Ainda não tem conta?</Text>
      <Button title="Criar conta" variant="secondary" onPress={() => navigation.navigate("SignUp")}/>


    </SafeAreaView>
  );
}
