import { SectionList, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getMealsRequest, MealsSection } from '../services/meals';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { PatientNavigationProps } from '../routes/patient.routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MealItem } from '../components/MealItem';
import { Header } from '../components/Header';
import dayjs from 'dayjs';

export function MealsHistory() {

    const navigation = useNavigation<PatientNavigationProps>()

    const {data: meals = [], isLoading} = useQuery<MealsSection[]>({
        queryKey: ["meals"],
        queryFn: getMealsRequest,
    })

  return (
     <SafeAreaView className="flex-1 bg-background px-6">  
    
          {/* Button */}
          <Text className="font-nunito_bold text-lg text-center text-gray-3 mt-6">
            Refeições
          </Text>
        
          {/* List */}
          <SectionList
            sections={meals}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <MealItem id={item.id} title={item.name} time={item.time} isOnDiet={item.isOnDiet}/>
            )}
            renderSectionHeader={({section: {title}}) => (
              <Header title={dayjs(title).format("DD/MM/YYYY")}/>
            )}
            ListEmptyComponent={() => (
              <View className="mt-20">
                <Text className="text-center text-gray-3 font-nunito_regular">Nenhum item na lista, Adicione uma refeição!</Text>
              </View>
            )}
            contentContainerStyle={{marginTop: 6, paddingBottom: 0}}
            style={{marginBottom: 20}}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
  )
}

