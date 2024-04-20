
import Watches from '../Screens/assignment3/Watches';
import WatchDetail from '../Screens/assignment3/WatchDetail';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feedbacks from '../Screens/assignment3/Feedbacks';

const Stack = createNativeStackNavigator();

export function WatchesStack() {
  return (
    <Stack.Navigator initialRouteName="Watches">
      <Stack.Screen name="Watches" component={Watches} />
      <Stack.Screen name="WatchDetail" component={WatchDetail} />
      <Stack.Screen name="Feedbacks" component={Feedbacks} />
    </Stack.Navigator>
  );
}
