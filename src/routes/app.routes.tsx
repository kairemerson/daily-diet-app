import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { AppStackParamList } from "../@types/navigation";
import { Statistics } from "../screens/Statistics";
import { MealForm } from "../screens/MealForm";

const Stack = createNativeStackNavigator<AppStackParamList>();

export type AppNavigationProps = NativeStackNavigationProp<AppStackParamList>


export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="MealForm" component={MealForm} />
    </Stack.Navigator>
  );
}
