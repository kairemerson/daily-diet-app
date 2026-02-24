
import { AdminRoutes } from "./admin.routes";
import { useAuth } from "../contexts/AuthContext";
import { PatientRoutes } from "./patient.routes";


//export type AppNavigationProps = NativeStackNavigationProp<AppStackParamList>


export function AppRoutes() {

  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <AdminRoutes />;
  }

  return <PatientRoutes />;

  // return (
  //   <Stack.Navigator screenOptions={{headerShown: false}}>
  //     <Stack.Screen name="Home" component={Home} />
  //     <Stack.Screen name="Statistics" component={Statistics} />
  //     <Stack.Screen name="MealForm" component={MealForm} />
  //     <Stack.Screen name="Feedback" component={Feedback} />
  //     <Stack.Screen name="MealDetails" component={MealDetails} />
  //   </Stack.Navigator>
  // );
}
