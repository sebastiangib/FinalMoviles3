import LoginScreen from './components/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import ForgotPassword from './components/ForgotPassword';
import CarScreen from './components/CarScreen';
import RentScreen from './components/RentScreen';
import HomeUser from './components/HomeUser';
import DevolucionScreen from './components/DevolucionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName='Login'
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{title:"Inicio de Sesión"}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"Pantalla Principal"}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{title:"Registrarse"}} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{title:"¿Olvidaste tu contraseña?"}} />
        <Stack.Screen name="Car" component={CarScreen} options={{title:"Vehiculos"}}/>
        <Stack.Screen name="Rent" component={RentScreen} options={{title:"Rentas"}}/>
        <Stack.Screen name="HomeUser" component={HomeUser} options={{title:"Inicio"}}/>
        <Stack.Screen name="Devolucion" component={DevolucionScreen} options={{title:"Devolucion de Vehiculos"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

