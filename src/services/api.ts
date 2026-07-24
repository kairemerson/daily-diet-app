import axios from "axios"
import { Platform } from "react-native";

// const BASE_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3333"
//     : "http://localhost:3333";

const BASE_URL = "http://192.168.1.105:3333"
// const BASE_URL = "https://api-dietwell.onrender.com"

export const api = axios.create({
  baseURL: BASE_URL,
});

type SignOutFunction = () => void;

let signOutCallback: SignOutFunction;

export function registerSignOut(signOut: SignOutFunction) {
  signOutCallback = signOut;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 🔥 Proteção 1: Se for erro de rede puro (ex: timeout do servidor local), não deslogue
    if (!error.response) {
      return Promise.reject(error);
    }

    // 🔥 Proteção 2: Evita deslogar em requisições de autenticação e rotas públicas
    const isAuthRoute = error.config.url?.includes("/sessions") || error.config.url?.includes("/login");

    if (error.response?.status === 401 && !isAuthRoute) {
      if (signOutCallback) {
        console.log("⚠️ Interceptor disparou 401 para a rota:", error.config.url);
        signOutCallback();
      }
    }

    return Promise.reject(error);
  }
);