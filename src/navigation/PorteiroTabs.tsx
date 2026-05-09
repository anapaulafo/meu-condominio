import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReservasPorteiroScreen from '../screens/Porteiro/ReservasPorteiroScreen'
import AvisosPorteiroScreen from "../screens/Porteiro/AvisosPorteiroScreen";

const Tab = createBottomTabNavigator();

export default function PorteiroTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Avisos" component={AvisosPorteiroScreen} />
      <Tab.Screen name="Reservas" component={ReservasPorteiroScreen} />
    </Tab.Navigator>
  );
}
