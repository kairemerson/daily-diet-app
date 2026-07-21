import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useStripe } from "@stripe/stripe-react-native"
import { colors } from "../theme/colors"
import { createSubscription, confirmSubscription } from "../services/subscribe"
import { getPlans, Plan } from "../services/plans"
import { useAuth } from "../contexts/AuthContext"

export function SubscriptionScreen() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  useEffect(() => {
    let isMounted = true

    async function loadPlans() {
      try {
        const data = await getPlans()
        // console.log("Subscription => data", data);
        if (!isMounted) return

        setPlans(data)
        setSelectedPlan(data.find((p) => p.highlight)?.id ?? data[0]?.id ?? null)
      } catch (err) {
        // console.log("Erro ao buscar planos:", err)
        if (!isMounted) return
        setError("Não foi possível carregar os planos. Tente novamente.")
      } finally {
        if (isMounted) setLoadingPlans(false)
      }
    }

    loadPlans()
    
    
    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubscribe() {
    if (!selectedPlan || !user) return
    
    setSubmitting(true)
    setError(null)
    
    try {
      const { subscriptionId, clientSecret, ephemeralKey, customerId } =
      await createSubscription(selectedPlan, user.id)

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Seu App",
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
      })

      if (initError) {
        setError(initError.message)
        return
      }

      const { error: presentError } = await presentPaymentSheet()

      if (presentError) {
        // Usuário cancelou ou o pagamento falhou — não é necessariamente um bug
        if (presentError.code !== "Canceled") {
          setError(presentError.message)
        }
        return
      }

      await confirmSubscription(subscriptionId)
      // navegue pra tela de sucesso ou atualize o contexto de auth/plano aqui
    } catch (err) {
      setError("Não foi possível concluir a assinatura. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingPlans) {
    return (
      <View className="flex-1 bg-gray-7 items-center justify-center">
        <ActivityIndicator size="large" color={colors.green.dark} />
      </View>
    )
  }

  return (
    <ScrollView>
      <View className="flex-1 bg-gray-7 px-6 pt-10">
        {/* HEADER */}
        <View className="mb-8">
          <Text className="text-3xl font-nunito_bold text-gray-1">Assine o Pro</Text>
          <Text className="text-gray-3 mt-2">
            Desbloqueie todos os recursos e acompanhe seus pacientes com mais eficiência
          </Text>
        </View>

        {/* PLANOS */}
        <View className="gap-4">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id

            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPlan(plan.id)}
                className={`rounded-2xl p-5 border ${
                  isSelected ? "border-green-dark bg-green-light" : "border-gray-5 bg-white"
                }`}
              >
                {plan.highlight && (
                  <View className="absolute top-3 right-3 bg-green-dark px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-nunito_bold">MELHOR OPÇÃO</Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center">
                  <View className="w-[97%]">
                    <Text className="text-lg font-nunito_bold text-gray-1">{plan.title}</Text>
                    <Text className="text-gray-3 text-sm mt-1">{plan.description}</Text>
                  </View>

                  <MaterialIcons
                    name={isSelected ? "radio-button-checked" : "radio-button-off"}
                    size={22}
                    color={isSelected ? colors.green.dark : colors.gray[4]}
                  />
                </View>

                <Text className="text-2xl font-nunito_bold text-gray-1 mt-4">{plan.price}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* BENEFÍCIOS */}
        <View className="mt-6 gap-3">
          {[
            "Planos alimentares ilimitados",
            "Histórico completo dos pacientes",
            "Relatórios e métricas avançadas",
          ].map((item) => (
            <View key={item} className="flex-row items-center gap-3">
              <MaterialIcons name="check-circle" size={20} color={colors.green.dark} />
              <Text className="text-gray-3">{item}</Text>
            </View>
          ))}
        </View>

        {error && (
          <Text className="text-red-500 text-sm text-center mt-4">{error}</Text>
        )}

        {/* CTA */}
        <View className="mt-8 mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubscribe}
            disabled={submitting || !selectedPlan}
            className={`py-4 rounded-2xl items-center ${
              submitting ? "bg-green-dark/60" : "bg-green-dark"
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-nunito_bold text-base">Assinar agora</Text>
            )}
          </TouchableOpacity>

          <Text className="text-center text-gray-4 text-xs mt-3">Pagamento seguro via Stripe</Text>
        </View>
      </View>
    </ScrollView>
  )
}