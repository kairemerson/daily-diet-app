import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import {useFonts} from "expo-font"
import * as Font from 'expo-font';
import {Nunito_400Regular, Nunito_700Bold} from "@expo-google-fonts/nunito"

import { Routes } from './src/routes';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from "react-native-toast-message"
import { BottomSheetProvider } from './src/contexts/BottomSheetContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { useEffect, useState } from 'react';
import { ModalProvider } from './src/contexts/ModalContext';

const queryClient = new QueryClient() //"new QueryClient()" dentro do App faz ele recriar a instância a cada render, o que quebra o cache e o Fast Refresh do React Native!

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   Nunito_400Regular, 
  //   Nunito_700Bold
  // })

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function loadAppResources() {
      try {
        await Font.loadAsync({
          Nunito_400Regular,
          Nunito_700Bold,
        });
      } catch (error) {
        console.warn("Erro ao carregar fontes, usando fontes padrão do sistema:", error);
      } finally {
        // Mesmo que dê erro, definimos como true para o app NUNCA travar em tela preta
        setFontsLoaded(true);
      }
    }

    loadAppResources();
  }, []);

  
  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  if (!fontsLoaded) {
    return null; // Evita carregar ícones quebrados ou fontes padrão do sistema
  }

  
  console.log("fonstLoaded: ", fontsLoaded);

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
