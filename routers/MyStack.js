import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Setting from '../screens/Setting'

const Stack = createStackNavigator()
export default function MyStack() {

    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}