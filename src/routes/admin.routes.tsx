import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeAdmin } from "../screens/HomeAdmin";
import { AdminStackParamList } from "../@types/navigation";



const Stack = createNativeStackNavigator<AdminStackParamList>()


export function AdminRoutes() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeAdmin" component={HomeAdmin}/>
        </Stack.Navigator>
    )
}