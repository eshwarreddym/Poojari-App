// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthenticationScreen from './screens/AuthenticationScreen';
import UserLoginScreen from './screens/UserLoginScreen';
import UserSignupScreen from './screens/UserSignupScreen';
import PanditLoginScreen from './screens/PanditLoginScreen';
import PanditSignupScreen from './screens/PanditSignupScreen';
import HomeScreen from './screens/HomeScreen';
import PoojaDetailsScreen from './screens/PoojaDetailsScreen';
import PanditDetailsScreen from './screens/PanditDetailsScreen';
import BookingScreen from './screens/BookingScreen';
import UserBookingsScreen from './screens/UserBookingsScreen';
import PanditBookingsScreen from './screens/PanditBookingsScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import PanditDashboardScreen from './screens/PanditDashboardScreen';
import PanditAvailableDatesScreen from './screens/PanditAvailableDatesScreen';
import PanditProfileScreen from './screens/PanditProfileScreen';
import DashboardScreen from './screens/DashboardScreenComponent';
import { auth } from './firebaseConfig';

const Stack = createStackNavigator();

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });

        return unsubscribe;
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="AuthenticationScreen">
                {user ? (
                    <>
                        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
                        <Stack.Screen name="HomeScreen" component={HomeScreen} />
                        <Stack.Screen name="UserBookingsScreen" component={UserBookingsScreen} />
                        <Stack.Screen name="PoojaDetailsScreen" component={PoojaDetailsScreen} />
                        <Stack.Screen name="PanditDetailsScreen" component={PanditDetailsScreen} />
                        <Stack.Screen name="BookingScreen" component={BookingScreen} />
                        <Stack.Screen name="PanditBookingsScreen" component={PanditBookingsScreen} />
                        <Stack.Screen name="PanditDashboardScreen" component={PanditDashboardScreen} />
                        <Stack.Screen name="PanditAvailableDatesScreen" component={PanditAvailableDatesScreen} />
                        <Stack.Screen name="PanditProfileScreen" component={PanditProfileScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="AuthenticationScreen" component={AuthenticationScreen} />
                        <Stack.Screen name="UserLoginScreen" component={UserLoginScreen} />
                        <Stack.Screen name="UserSignupScreen" component={UserSignupScreen} />
                        <Stack.Screen name="PanditLoginScreen" component={PanditLoginScreen} />
                        <Stack.Screen name="PanditSignupScreen" component={PanditSignupScreen} />
                        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
