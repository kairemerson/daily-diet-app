import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeAdmin } from "../screens/HomeAdmin";
import { AdminStackParamList } from "../@types/navigation";
import { PatientCreateForm } from "../components/PatientCreateForm";
import { NutritionistProfile } from "../screens/NutritionistProfile";
import { PatientDetails } from "../screens/PatientDetails";
import CreateMealPlan from "../screens/CreateMealPlan";



const Stack = createNativeStackNavigator<AdminStackParamList>()

export type AdminNavigationProps = NativeStackNavigationProp<AdminStackParamList>;

export function AdminRoutes() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeAdmin" component={HomeAdmin}/>
            <Stack.Screen name="PatientCreateForm" component={PatientCreateForm}/>
            <Stack.Screen name="NutritionistProfile" component={NutritionistProfile}/>
            <Stack.Screen name="PatientDetails" component={PatientDetails}/>
            <Stack.Screen name="CreateMealPlan" component={CreateMealPlan}/>
        </Stack.Navigator>
    )
}