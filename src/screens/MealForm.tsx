import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "./Home";
import { HeaderPage } from "../components/HeaderPage";
import { SafeAreaView } from "react-native-safe-area-context";


export function MealForm() {
    const navigation = useNavigation<NavigationProps>()
    return (
        <View className="flex-1 bg-white">
            <HeaderPage/>

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-8 -mt-4">

            </View>
        </View>
    )
}