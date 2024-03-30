import { View, Text, Button, Modal, TextInput, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { MapGuest } from './components/Map';
import { LoginView } from './components/Login';
import { AdminView } from './components/AdminView';
import { Test } from './components/Test';
import { SelectGroupAdmin, SelectGroupGuest } from './components/SelectGroup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { isTokenValid, login } from './services/deviceService';


function HomeScreen({ navigation }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleModal = async () => {
        const validToken = await isTokenValid();
        if (validToken) {
            navigation.navigate('GroupAdmin');
        } else {
            setModalVisible(true);
        }
    };

    const handleLogin = async () => {
        const response = await login(username, password);
        if (response){
            setModalVisible(false)
            navigation.navigate('GroupAdmin');
        }
        else{
            console.log("error al realizar el login");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Button title='Administrador' onPress={handleModal}></Button>
            <Button title='Participante' onPress={() => navigation.navigate('Seleccionar grupo')}></Button>
            <Button title='Test' onPress={() => navigation.navigate('Test')} ></Button>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput placeholder='Usuario' style={styles.inputField} onChangeText={setUsername} placeholderTextColor={'black'}></TextInput>
                        <TextInput placeholder='Contraseña' style={styles.inputField} onChangeText={setPassword} placeholderTextColor={'black'} secureTextEntry={true} ></TextInput>
                        <View style={styles.buttonContainer}>
                            <Button title='Login' onPress={handleLogin}></Button>
                            <Button title='Cerrar' onPress={() => setModalVisible(false)}></Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Simulación" component={MapGuest} />
                <Stack.Screen name="Login" component={LoginView} />
                <Stack.Screen name="Simulación administrador" component={AdminView} />
                <Stack.Screen name='Seleccionar grupo' component={SelectGroupGuest} />
                <Stack.Screen name='GroupAdmin' component={SelectGroupAdmin} />
                <Stack.Screen name='Test' component={Test} />
            </Stack.Navigator>
        </NavigationContainer>

    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5
    },
    inputField: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        color: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
    },
})
export default App;
