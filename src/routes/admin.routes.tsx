import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeAdmin } from "../screens/HomeAdmin";
import { AdminStackParamList } from "../@types/navigation";
import { PatientCreateForm } from "../components/PatientCreateForm";
import { NutritionistProfile } from "../screens/NutritionistProfile";
import { PatientDetails } from "../screens/PatientDetails";
import CreateMealPlan from "../screens/CreateMealPlan";
import { MealPlansHistory } from "../screens/MealPlansHistory";
import { MealsHistory } from "../screens/MealsHistory";
import { MealHistory } from "../screens/MealHistory";
import { MealPlanDetails } from "../screens/MealPlanDetails";



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
            <Stack.Screen name="MealPlansHistory" component={MealPlansHistory}/>
            <Stack.Screen name="MealHistory" component={MealHistory}/>
            <Stack.Screen name="MealPlanDetails" component={MealPlanDetails}/>
        </Stack.Navigator>
    )
}