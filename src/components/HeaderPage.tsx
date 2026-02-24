import { MaterialIcons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../theme/colors'
import { useNavigation } from '@react-navigation/native'
import { AppNavigationProps } from '../routes/app.routes'

type HeaderPageProps = {
    variant?: "primary" | "secondary" | "neutral"
    title: string
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

export function HeaderPage({variant="primary", title}: HeaderPageProps) {
    const navigation = useNavigation<AppNavigationProps>()

    const styles = VARIANT_STYLES[variant]
    
  return (
    <View className={`p-6 pb-14 pt-14 flex-row ${styles.container}`}>
        
        <View className='flex-1'>
            <TouchableOpacity activeOpacity={1} className="flex-1 ml-1 mr-auto p-2 pl-0 absolute -top-1 z-10" onPress={() => navigation.navigate("Home")}>
                <MaterialIcons name="arrow-back" size={26} color={styles.iconColor}/>
            </TouchableOpacity>
            <Text className="font-nunito_bold text-center text-lg text-gray-1 mt-1">
                {title}
            </Text>

        </View>
    </View>
  )
}

