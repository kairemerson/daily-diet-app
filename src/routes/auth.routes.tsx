import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { AuthStackParamList } from "../@types/navigation"
import { SignIn } from "../screens/SignIn"

const Stack = createNativeStackNavigator<AuthStackParamList>()


export function AuthRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignIn}/>
            {/* <Stack.Screen name="SignUp" component={SignUp}/> */}
        </Stack.Navigator>
    )
}