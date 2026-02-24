import { Image, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '../components/Button'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigationProps } from '../routes/app.routes'
import { AppStackParamList } from '../@types/navigation'

type RouteProps = RouteProp<AppStackParamList, "Feedback">;


export default function Feedback() {

    const route = useRoute<RouteProps>()
    const {isOnDiet} = route.params

    const navigation = useNavigation<AppNavigationProps>()    
    
  return (
    <SafeAreaView className='flex-1 bg-white pt-32 px-6 items-center'>

      {isOnDiet ? (
        <>
          <Text className='font-nunito_bold text-green-dark text-2xl'>Continue assim!</Text>
          <Text className='text-gray-1 text-base text-center mt-4'>
            Você continua <Text className='font-nunito_bold leading-tight'>dentro da dieta</Text> muito bem! 
          </Text>
          <Image source={require("../assets/feedback-true.png")} className='my-10'/>
        </>

      ) : (
        <>
          <Text className='font-nunito_bold text-red-dark text-2xl'>Que pena!</Text>
          <Text className='text-gray-1 text-base text-center mt-4'>
            Você <Text className='font-nunito_bold leading-tight'>saiu da dieta</Text> dessa vez, mas continue
            se esforçando e não desista! 
          </Text>
          <Image source={require("../assets/feedback-false.png")} className='my-10'/>
        </>
      )}

      <View className='flex-row px-20'>
        <Button title='Ir para página inicial ' onPress={() => navigation.navigate("Home")}/>
      </View>
    </SafeAreaView>
  )
}

