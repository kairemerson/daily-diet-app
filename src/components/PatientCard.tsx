import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AdherenceBadge } from './AdherenceBadge'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../theme/colors'

type Props = {
    name: string
    adherence: number
    lastActivity: string
    onPress: () => void
}

export default function PatientCard({adherence, name, lastActivity, onPress}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-5 "
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        
        <View className="flex-row items-center gap-3 flex-1">
            <View className='w-12 h-12 bg-gray-5 rounded-full items-center justify-center'>
                <MaterialIcons name='person' size={24} color={colors.gray[2]}/>

            </View>

          <View className="flex-1">
            <Text className="text-base font-nunito_bold text-gray-1">
              {name}
            </Text>

            <Text className="text-xs text-gray-3 mt-1">
              Última atividade: {lastActivity}
            </Text>
          </View>
        </View>

        <AdherenceBadge percentage={adherence} />
      </View>
    </TouchableOpacity>
  )
}

