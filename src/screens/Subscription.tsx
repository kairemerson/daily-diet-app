import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useStripe } from "@stripe/stripe-react-native";
import { createSubscription, confirmSubscription } from "../services/subscribe";
import { getPlans, Plan } from "../services/plans";
import { useAuth } from "../contexts/AuthContext";
import Toast from "react-native-toast-message";
import { colors } from "../theme/colors";
import { AdminNavigationProps } from "../routes/admin.routes";
import { api } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

export function SubscriptionScreen() {
  const navigation = useNavigation<AdminNavigationProps>()
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { user, updateUser } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const queryClient = useQueryClient()

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      try {
        const response = await getPlans();
        if (!isMounted) return;

        const plansArray = response.plans || []

        setPlans(plansArray);
        setSelectedPlan(plansArray.find((p) => p.highlight)?.id ?? plansArray[0]?.id ?? null);
      } catch (err) {
        if (!isMounted) return;
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar os planos locais."
        });
      } finally {
        if (isMounted) setLoadingPlans(false);
      }
    }

    loadPlans();
    return () => { isMounted = false; };
  }, []);

  async function handleSubscribe() {
    if (!selectedPlan || !user) return;
    
    setSubmitting(true);
    
    try {
      // 1. Criar a assinatura no seu Backend
      const { subscriptionId, clientSecret, ephemeralKey, customerId } =
        await createSubscription({
          priceId: selectedPlan,
          userId: user.id,
        });

      // 2. Inicializar a folha de pagamento nativa do Stripe (Payment Sheet)
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Daily Diet App",
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        Toast.show({ type: "error", text1: "Erro Stripe", text2: initError.message });
        setSubmitting(false);
        return;
      }

      // 3. Apresentar a folha de pagamento nativa na tela
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== "Canceled") {
          Toast.show({ type: "error", text1: "Falha", text2: presentError.message });
        }
        setSubmitting(false);
        return;
      }

      // FLUXO DIRETO E SEGURO:
      // O modal fechou com sucesso e o cartão foi aceito (Stripe CLI deu 200 no seu terminal).
      // O Webhook já está encarregado de mudar o status do usuário no banco.
      // Redirecionamos o usuário imediatamente para evitar erros de latência de rede.
    
      const response = await api.get("/users/me")
      const userUpdated = response.data

      await queryClient.invalidateQueries({  queryKey: ["userProfile"], refetchType: "all" })
      await updateUser(userUpdated)

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Sua assinatura foi ativada com sucesso."
      });
      
      navigation.navigate("Success");

    } catch (err) {
      console.log("Erro capturado no fluxo geral:", err);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível concluir a assinatura. Tente novamente."
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPlans) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.green.dark} />
      </View>
    );
  }

  
  
  return (
    <ScrollView className="flex-1 bg-zinc-950">
      <View className="px-6 pt-10 pb-10">
        
        {/* HEADER */}
        <View className="mb-8">
          <Text className="text-3xl font-nunito_bold text-white">Assine o Pro</Text>
          <Text className="text-zinc-400 mt-2 text-sm leading-relaxed">
            Desbloqueie todos os recursos e acompanhe seus pacientes com mais eficiência.
          </Text>
        </View>

        {/* LISTAGEM DE PLANOS */}
        <View className="gap-4">
          {plans?.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.85}
                onPress={() => setSelectedPlan(plan.id)}
                className={`rounded-2xl p-5 border relative ${
                  isSelected ? "border-green-600 bg-green-950/30" : "border-zinc-800 bg-zinc-900"
                }`}
              >
                {plan.highlight && (
                  <View className="absolute -top-3 right-4 bg-green-600 px-3 py-1 rounded-full z-10">
                    <Text className="text-white text-[10px] font-nunito_bold tracking-wider">MELHOR OPÇÃO</Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center">
                  <View className="flex-1 pr-4">
                    <Text className="text-lg font-nunito_bold text-white">{plan.title}</Text>
                    <Text className="text-zinc-400 text-xs mt-1 leading-snug">{plan.description}</Text>
                  </View>

                  <MaterialIcons
                    name={isSelected ? "radio-button-checked" : "radio-button-off"}
                    size={22}
                    color={isSelected ? "#16a34a" : "#a1a1aa"}
                  />
                </View>

                <View className="flex-row items-baseline mt-4 gap-1">
                  <Text className="text-2xl font-nunito_bold text-white">{plan.price}</Text>
                  {plan.interval && (
                    <Text className="text-zinc-500 text-xs font-nunito_regular">/{plan.interval}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* BENEFÍCIOS */}
        <View className="mt-8 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-900 gap-3">
          {[
            "Planos alimentares ilimitados",
            "Histórico completo dos pacientes",
            "Relatórios e métricas avançadas",
          ].map((item) => (
            <View key={item} className="flex-row items-center gap-3">
              <MaterialIcons name="check-circle" size={18} color="#16a34a" />
              <Text className="text-zinc-300 text-sm font-nunito_regular">{item}</Text>
            </View>
          ))}
        </View>

        {/* BOTÃO ASSINAR */}
        <View className="mt-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubscribe}
            disabled={submitting || !selectedPlan}
            className={`py-4 rounded-2xl items-center justify-center ${
              submitting ? "bg-green-600/50" : "bg-green-600"
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-nunito_bold text-base">Assinar agora</Text>
            )}
          </TouchableOpacity>

          <Text className="text-center text-zinc-500 text-xs mt-3 font-nunito_regular">
            Pagamento seguro criptografado via Stripe
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
