import { StatusBar } from 'expo-status-bar';
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
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { useState } from 'react';
import { ModalProvider } from './src/contexts/ModalContext';


export default function App() {
  const [fontsLoaded] = useFonts({Nunito_400Regular, Nunito_700Bold})
  const queryClient = new QueryClient()

   const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
      return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
    }
  return (
    <GestureHandlerRootView style={{flex: 1}}>

      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <BottomSheetModalProvider>
            <BottomSheetProvider>
                <AuthProvider>
                  <StatusBar style="auto" />
                    <Routes/>
                  <Toast />
                </AuthProvider>
            </BottomSheetProvider>
          </BottomSheetModalProvider>
        </ModalProvider>
        </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
