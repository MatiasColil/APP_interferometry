import Geolocation from '@react-native-community/geolocation';
import { fetchDevicePositions, fetchOrGenerateUUID, simulation, sendToken, fetchReferencePoint, checkDeviceExists, sendPositionToServer } from '../services/deviceService'
import { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import DeviceMap from '../components/DeviceMap';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getCurrent = async (deviceUUID) => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (pos) => {
                const newPosition = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    altitude: pos.coords.altitude,
                    latitudeDelta: 0.0000001,
                    longitudeDelta: 0.0000001,
                };
                if (deviceUUID && newPosition) {
                    sendPositionToServer(deviceUUID, newPosition);
                }
                resolve(newPosition);
            },
            (error) => {
                reject(error);
            },
            {
                maximumAge: 0,
                enableHighAccuracy: true,
            }
        );
    });
};


export function MapGuest() {

    messaging().onMessage(remoteMessage => {
        simulation().then(image => {
            setCurrentImage(image);
        })
        console.log("mensaje activo");
    });

    /* const fetchImage = async () => {
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
    }; */

    const [devicePositions, setDevicePositions] = useState([]);

    const [deviceUUID, setDeviceUUID] = useState(null);

    const [position, setPosition] = useState(null);

    const [currentImage, setCurrentImage] = useState(null);
    const [referencePoint, setReferencePoint] = useState(null);

    /* useEffect(() => {
        fetchOrGenerateUUID().then(uuid => {
            messaging().getToken().then(token => {
                sendToken(uuid, token);
            });
        });
        const intervalId = setInterval(() => {
            fetchOrGenerateUUID().then(uuid => {
                setDeviceUUID(uuid);
                getCurrent(uuid).then(setPosition);
            });
            fetchDevicePositions().then(poss => {
                if (poss) setDevicePositions(poss);
            });
            fetchReferencePoint().then(point => {
                if (point) setReferencePoint(point);
            });
        }, 3000);
        return () => clearInterval(intervalId);
    }, []); */

    useEffect(() => {
        const fetchData = async () => {
            const uuid = await fetchOrGenerateUUID();
            const token = await messaging().getToken();
            await sendToken(uuid, token);
            return uuid;
        };
    
        const continuousFetch = async () => {
            const uuid = await fetchData();
            while (true) {
                try {
                    await getCurrent(uuid).then(setPosition);
                    const poss = await fetchDevicePositions();
                    if (poss) setDevicePositions(poss);
    
                    const point = await fetchReferencePoint();
                    if (point) setReferencePoint(point);
    
                    // Pausa de 3 segundos antes de la siguiente iteración.
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error("Error during continuous fetch:", error);
                }
            }
        };
    
        continuousFetch();
    
        // No hay necesidad de limpiar usando clearInterval ya que estamos usando setTimeout dentro de la función.
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                {/* <DeviceList devicePositions={devicePositions} /> */}
                {currentImage && <Image source={{ uri: currentImage }} style={{ width: '100%', height: '100%' }} />}
            </View>
            <DeviceMap position={position} devicePositions={devicePositions} refPoint={referencePoint} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    container2: {
        flex: 0.6,
        borderColor: 'black',
        borderWidth: 2,
        width: '100%'
    }
})