import AsyncStorage from "@react-native-async-storage/async-storage"

export interface StoredUser {
    id: string
    name: string
    email: string
    role: "ADMIN" | "PATIENT"
    isPro: boolean
    plan: "FREE" | "STARTER" | "PRO" | "PREMIUM"; 
    maxPatients: number;                         
    currentPatientsCount: number;
    isSubscriptionExpired: boolean
}


const DAILY_DIET_USER_KEY = "@dailyDiet:user"
const DAILY_DIET_TOKEN_KEY = "@dailyDiet:token"

export async function saveUser(userData: StoredUser, userToken: string) {
    await AsyncStorage.setItem(DAILY_DIET_USER_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(DAILY_DIET_TOKEN_KEY, userToken);
    
}

export async function getUser() {
    const user = await AsyncStorage.getItem(DAILY_DIET_USER_KEY)
    const token = await AsyncStorage.getItem(DAILY_DIET_TOKEN_KEY)

    if(!user || !token) return null

    return {
        user: JSON.parse(user),
        token
    }
}

export async function removeUser() {
    await AsyncStorage.removeItem(DAILY_DIET_USER_KEY)
    await AsyncStorage.removeItem(DAILY_DIET_TOKEN_KEY)
}

export async function updateUserStorage(updatedFields: Partial<StoredUser>) {
  const currentData = await AsyncStorage.getItem(DAILY_DIET_USER_KEY);
  
  if (!currentData) return;

  const currentUser: StoredUser = JSON.parse(currentData);

  // Mantém todas as propriedades antigas e atualiza apenas os novos campos (ex: name, email)
  const updatedUser: StoredUser = {
    ...currentUser,
    ...updatedFields,
  };

  await AsyncStorage.setItem(DAILY_DIET_USER_KEY, JSON.stringify(updatedUser));
  
  return updatedUser;
}