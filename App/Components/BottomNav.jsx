import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Watches from '../Screens/assignment3/Watches';

const Tab = createBottomTabNavigator();

export function BottomNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Watch" component={Watches} />
    </Tab.Navigator>
  );
}