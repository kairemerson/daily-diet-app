import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { ActivityIndicator } from "react-native";

export function Routes() {
  const { user, loading } = useAuth();

  if(loading) {
    return <ActivityIndicator/>
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
