import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";

import MoradorTabs from "./src/navigation/MoradorTabs";
import PorteiroTabs from "./src/navigation/PorteiroTabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Cadastro" component={CadastroScreen} />

        <Stack.Screen
          name="MoradorTabs"
          component={MoradorTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PorteiroTabs"
          component={PorteiroTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
