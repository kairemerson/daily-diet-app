import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { MealsHistory } from "../screens/MealsHistory";
import { HomeAdmin } from "../screens/HomeAdmin";
import { NutritionistProfile } from "../screens/NutritionistProfile";
import { SubscriptionScreen } from "../screens/Subscription";

const Tab = createBottomTabNavigator();

export function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, //remove texto
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
        component={HomeAdmin}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="home" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="NutritionistProfile"
        component={NutritionistProfile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SubscriptionScreen"
        component={SubscriptionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

