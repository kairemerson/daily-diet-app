import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
// import { Statistics } from "../screens/Statistics";
import { AppStackParamList } from "../@types/navigation";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="Statistics" component={Statistics} /> */}
    </Stack.Navigator>
  );
}
