import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { simulation } from '../services/deviceService';
//import AsyncStorage from '@react-native-async-storage/async-storage';


/* messaging().setBackgroundMessageHandler( async remoteMessage => {
    console.log("notif");
}); */

/* async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }e
} */

export function Test1({ navigation }) {

    const [currentImage, setCurrentImage] = useState(null);

    const fetchImage = async () => {
        try {
            const response = await fetch('http://10.0.2.2:8000/api/test2/');
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                setCurrentImage(base64data);
            };
        } catch (error) {
            console.error("Hubo un error al obtener la imagen:", error);
        }
    };


    /* useEffect(() => {

        messaging().
            getToken().
            then(token => {
                console.log("------------------")
                console.log(token);
                console.log("------------------")
            });
        // Esto maneja el mensaje cuando la aplicación está activa
        const unsubscribe = messaging().onMessage( remoteMessage => {
            fetchImage();
            console.log("mensaje activo")
        });
        return unsubscribe;
    }, []); */
    return (

        <View style={{ flex: 1 }}>
            {/* {currentImage && <Image source={{ uri: currentImage }} style={{ width: '100%', height: '100%' }} />} */}
            <Text>Hola</Text>
        </View>
    );
}