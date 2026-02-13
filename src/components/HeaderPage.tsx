import { MaterialIcons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../theme/colors'
import { useNavigation } from '@react-navigation/native'
import { NavigationProps } from '../screens/Home'

type HeaderPageProps = {
    variant?: "primary" | "secondary" | "neutral"
}

const VARIANT_STYLES = {
    primary: {
        container: "bg-green-light",
        iconColor: colors.green.dark
    },
    secondary: {
        container: "bg-red-light",
        iconColor: colors.red.dark
    },
    neutral: {
        container: "bg-gray-6",
        iconColor: colors.gray[1]
    },
} as const

export function HeaderPage({variant="primary"}: HeaderPageProps) {
    const navigation = useNavigation<NavigationProps>()

    const styles = VARIANT_STYLES[variant]
    
  return (
    <View className={`p-6 pb-12 pt-16 flex-row ${styles.container}`}>
        
        <View className='flex-1'>
            <TouchableOpacity activeOpacity={0.7} className="mr-auto p-1 absolute -top-1" onPress={() => navigation.navigate("Home")}>
                <MaterialIcons name="arrow-back" size={24} color={styles.iconColor}/>
            </TouchableOpacity>
            <Text className="font-nunito_bold text-center text-lg text-gray-1">
                Nova refeição
            </Text>

        </View>
    </View>
  )
}

