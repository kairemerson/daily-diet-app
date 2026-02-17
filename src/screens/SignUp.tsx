import { View, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppInput from "../components/AppInput";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProps } from "../routes/auth.routes";
import { SignUpFormData, signUpSchema } from "./schema/signUpSchema";

export function SignUp() {
  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigationProps>()

  const {control, handleSubmit} = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  async function onSubmit(data: any) {
    console.log("signin data: ", data);
    
  }

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <Text className="text-gray-1 text-xl text-center mb-20 mt-20 font-nunito_bold">
        Crie sua conta
      </Text>

      <View className="mb-10"> 
        <AppInput
          name="name"
          control={control}
          label="Nome"
          placeholder="Digite seu nome"
          icon="person-outline"
          keyboardType="email-address"
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

      </View>

      <Button title="Cadastrar" onPress={handleSubmit(onSubmit)}/>

      <Text className="text-center text-gray-3 text-base mt-10 mb-2">Já tem uma conta?</Text>
      <Button title="Fazer login" variant="secondary" onPress={() => navigation.navigate("SignIn")}/>


    </SafeAreaView>
  );
}
