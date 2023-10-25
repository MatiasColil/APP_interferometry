import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { simulation } from '../services/deviceService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Test1({ navigation }) {

    const [currentImage, setCurrentImage] = useState(null);

    const fetchImage = async () => {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const positions = await fetch(`http://10.0.2.2:8000/api/register/?actual_group=${storeGroupID}`);
        const refPoint = await fetch(`http://10.0.2.2:8000/api/ref/${storeGroupID}/`);
        const dataPos = await positions.json();
        const dataRef = await refPoint.json();
        try {
            const response = await fetch('http://10.0.2.2:8000/api/simulation/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        locations: dataPos,
                        reference: dataRef,
                    }),
                });
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


    useEffect(() => {

        const unsubscribe = messaging().onMessage(remoteMessage => {
            //fetchImage();
            simulation().then(img => {
                setCurrentImage(img);
            })

            console.log("mensaje activo")
        });
        return unsubscribe;
    }, []);
    return (

        <View style={{ flex: 1 }}>
            {currentImage && <Image source={{ uri: currentImage }} style={{ width: '100%', height: '100%' }} />}
            <Text>Hola</Text>
        </View>
    );
}