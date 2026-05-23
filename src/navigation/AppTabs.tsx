import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ReservasScreen from "../screens/Morador/ReservasScreen";
import AvisosScreen from "../screens/Morador/AvisosScreen";
import EncomendasScreen from "../screens/Morador/EncomendasScreen";
import PerfilScreen from "../screens/shared/PerfilScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{
  headerShown: false,

  tabBarStyle: {
    height: 72,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 10,
  },

  tabBarActiveTintColor: '#1E3A5F',
  tabBarInactiveTintColor: '#94A3B8',
}}>
      <Tab.Screen name="Reservas" component={ReservasScreen} />
      <Tab.Screen name="Avisos" component={AvisosScreen} />
      <Tab.Screen name="Encomendas" component={EncomendasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen}/>
    </Tab.Navigator>
  );
}

