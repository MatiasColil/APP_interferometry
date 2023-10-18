import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenValid } from '../services/deviceService';

export function LoginView({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://10.0.2.2:8000/api/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                await AsyncStorage.setItem('accessToken', data.access);
                navigation.navigate('GroupAdmin');
            } else {
                const errorData = await response.json();
                alert(errorData.detail);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const validToken = await isTokenValid();
            if (validToken) {
                navigation.navigate('True');
            }
        };
        
        checkAuth();
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
            ></TextInput>
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
            ></TextInput>
            <Button
                title='Login'
                onPress={handleLogin}
            ></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});
