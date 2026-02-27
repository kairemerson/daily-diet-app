import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import { PatientStackParamList } from "../@types/navigation";
import { Home } from "../screens/Home";
import { Statistics } from "../screens/Statistics";
import { MealForm } from "../screens/MealForm";
import Feedback from "../screens/Feedback";
import MealDetails from "../screens/MealDetails";


const Stack = createNativeStackNavigator<PatientStackParamList>();

export type PatientNavigationProps = NativeStackNavigationProp<PatientStackParamList>;

export function PatientRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="MealForm" component={MealForm} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="MealDetails" component={MealDetails} />
    </Stack.Navigator>
  );
}