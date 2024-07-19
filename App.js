import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthenticationScreen from './screens/AuthenticationScreen';
import UserLoginScreen from './screens/UserLoginScreen';
import UserSignupScreen from './screens/UserSignupScreen';
import PanditLoginScreen from './screens/PanditLoginScreen';
import PanditSignupScreen from './screens/PanditSignupScreen';
import HomeScreen from './screens/HomeScreen';
import PoojaDetailsScreen from './screens/PoojaDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import UserBookingsScreen from './screens/UserBookingsScreen';
import PanditBookingsScreen from './screens/PanditBookingsScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
//import addPoojasToFirestore from './data/addPoojaData';

const Stack = createStackNavigator();

const App = () => {
    // useEffect(() => {
    //      addPoojasToFirestore();
    //  }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="AuthenticationScreen">
                <Stack.Screen name="AuthenticationScreen" component={AuthenticationScreen} />
                <Stack.Screen name="UserLoginScreen" component={UserLoginScreen} />
                <Stack.Screen name="UserSignupScreen" component={UserSignupScreen} />
                <Stack.Screen name="PanditLoginScreen" component={PanditLoginScreen} />
                <Stack.Screen name="PanditSignupScreen" component={PanditSignupScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="PoojaDetailsScreen" component={PoojaDetailsScreen} />
                <Stack.Screen name="BookingScreen" component={BookingScreen} />
                <Stack.Screen name="UserBookingsScreen" component={UserBookingsScreen} />
                <Stack.Screen name="PanditBookingsScreen" component={PanditBookingsScreen} />
                <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
