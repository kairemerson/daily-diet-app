import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import "./global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import {useFonts} from "expo-font"
import {Nunito_400Regular, Nunito_700Bold} from "@expo-google-fonts/nunito"
import { Routes } from './src/routes';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from "react-native-toast-message"
import { BottomSheetProvider } from './src/contexts/BottomSheetContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  const [fontsLoaded] = useFonts({Nunito_400Regular, Nunito_700Bold})

  const queryClient = new QueryClient()

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>

      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <BottomSheetProvider>
            <AuthProvider>
              <StatusBar style="auto" />
                <Routes/>
              <Toast/>
            </AuthProvider>
            </BottomSheetProvider>

        </BottomSheetModalProvider>

      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
