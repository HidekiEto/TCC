import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from '../screens/Welcome'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Login from '../screens/Login'

const Stack = createNativeStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "Welcome"
                component = { Welcome }
                options={{ headerShown: false }}
            />
            
            <Stack.Screen
                name = "Register"
                component = { Register }
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name = "Home"
                component = { Home }
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name = "Login"
                component= { Login }
                options={{ headerShown: false}}
            />
        </Stack.Navigator>
    );
}