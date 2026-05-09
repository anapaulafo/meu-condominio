import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ReservasScreen from "../screens/Morador/ReservasScreen";
import AvisosScreen from "../screens/Morador/AvisosScreen";
import EncomendasScreen from "../screens/Morador/EncomendasScreen";

const Tab = createBottomTabNavigator();

export default function MoradorTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reservas" component={ReservasScreen} />

      <Tab.Screen name="Avisos" component={AvisosScreen} />

      <Tab.Screen name="Encomendas" component={EncomendasScreen} />
    </Tab.Navigator>
  );
}
