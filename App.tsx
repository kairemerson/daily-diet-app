import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import "./global.css";

import {useFonts} from "expo-font"
import {Nunito_400Regular, Nunito_700Bold} from "@expo-google-fonts/nunito"
import { Routes } from './src/routes';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({Nunito_400Regular, Nunito_700Bold})

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AuthProvider>
        <StatusBar style="auto" />
        <Routes/>
    </AuthProvider>
  );
}
