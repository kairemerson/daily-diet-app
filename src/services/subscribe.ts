import { api } from "./api"

type CreateSubscriptionParams = {
  priceId: string
  userId: string
}

type CreateSubscriptionResponse = {
  subscriptionId: string
  clientSecret: string
  ephemeralKey: string
  customerId: string
}

export async function createSubscription({
  priceId,
  userId,
}: CreateSubscriptionParams): Promise<CreateSubscriptionResponse> {
  const response = await api.post("/subscriptions", {
    priceId,
    userId,
  })

  return response.data
}

// --------------------------------------------

type ConfirmSubscriptionResponse = {
  status: string
}

export async function confirmSubscription(
  subscriptionId: string
): Promise<ConfirmSubscriptionResponse> {
  const response = await api.post(
    `/subscriptions/${subscriptionId}/confirm`
  )

  return response.data
}