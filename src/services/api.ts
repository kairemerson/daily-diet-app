import axios from "axios"
import { Platform } from "react-native";

// const BASE_URL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3333"
//     : "http://localhost:3333";

const BASE_URL = "http://192.168.1.101:3333"

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
    if (error.response?.status === 401 && error.config.url !== "/sessions") {
      if (signOutCallback) {
        signOutCallback();
      }
    }

    return Promise.reject(error);
  }
);