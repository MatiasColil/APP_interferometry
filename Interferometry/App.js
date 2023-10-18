import {  View, Text, Button } from 'react-native';
import { MapGuest } from './components/Map';
import { LoginView } from './components/Login';
import { AdminView } from './components/AdminView';
import { SelectGroupAdmin, SelectGroupGuest } from './components/SelectGroup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isTokenValid } from './services/deviceService';


function HomeScreen({ navigation }) {
    const handleAdminPress = async () => {
        const validToken = await isTokenValid();

        if (validToken) {
            navigation.navigate('GroupAdmin');
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Button title='Administrador' onPress={handleAdminPress}></Button>
            <Button title='Invitado' onPress={() => navigation.navigate('GroupGuest')}></Button>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function App (){
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapGuest} />
            <Stack.Screen name="Login" component={LoginView}/>
            <Stack.Screen name="True" component={AdminView}/>
            <Stack.Screen name='GroupGuest' component={SelectGroupGuest}/>
            <Stack.Screen name='GroupAdmin' component={SelectGroupAdmin}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
}
export default App;
