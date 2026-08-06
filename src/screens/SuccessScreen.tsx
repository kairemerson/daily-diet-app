import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';

import { AdminNavigationProps } from '../routes/admin.routes';

export function SuccessScreen() {
  
  const navigation = useNavigation<AdminNavigationProps>();

  function handleGoHome() {
      navigation.navigate("AdminTabs");
  }

  return (
    <SafeAreaView className='flex-1 bg-white pt-32 px-6 items-center'>
      
      <Text className='font-nunito_bold text-green-dark text-2xl text-center'>
        Assinatura Ativada!
      </Text>
      
      <Text className='text-gray-1 text-base text-center mt-4 px-4 leading-relaxed'>
        Parabéns! Você agora é <Text className='font-nunito_bold text-green-dark'>Assinante</Text>. 
        Todos os recursos avançados e limites foram desbloqueados para você.
      </Text>

      
      <Image 
        source={require("../assets/feedback-true.png")} 
        className='my-10'
      />

      <View className='flex-row px-20 mt-4'>
        <Button 
          title='Ir para página inicial' 
          onPress={handleGoHome}
        />
      </View>

    </SafeAreaView>
  );
}
