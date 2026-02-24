import { Text, View } from 'react-native'

type Props = {
    percentage: number
}

export function AdherenceBadge({percentage}: Props) {

    const getColor = () => {
        if(percentage >= 80) return "bg-green-mid"
        if(percentage >= 80) return "bg-yellow-300"
        return "bg-red-mid"
    }
  return (
    <View className={`px-3 py-1 rounded-full ${getColor()}`}>
      <Text className='text-white text-xs font-semibold'>{percentage}%</Text>
    </View>
  )
}

