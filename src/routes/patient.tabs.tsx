import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { HomePatient } from "../screens/HomePatient";
import { MealsHistory } from "../screens/MealsHistory";
import { ProfilePatient } from "../screens/ProfilePatient";

const Tab = createBottomTabNavigator();

export function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // 🔥 remove texto
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
            elevation: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomePatient}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="home" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={MealsHistory}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfilePatient}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}