import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, Dimensions, Text, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';


function App() {

    const [devicePositions, setDevicePositions] = useState([]);

    const fetchDevicePositions = async () => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/api/register/`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener posiciones:', error);
            return null;
        }
    };

    const checkDeviceExists = async (uuid) => {
        try {
            const response = await fetch(`http://10.0.2.2:8000/api/register/${uuid}/`);
            if (response.ok) {
                return true
            }
            if (response.status === 404) {
                return false;
            }
            throw new Error('Unexpected API response');
        } catch (error) {
            console.error("Error checking device existence:", error);
            return false;
        }
    };

    const sendPositionToServer = async (uuid, position) => {
        try {
            let exist = await checkDeviceExists(uuid);
            let metodo = exist ? 'PUT' : 'POST';
            let string = `http://10.0.2.2:8000/api/register/${exist ? uuid + "/" : ""}`
            const response = await fetch(string, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: uuid,
                    latitude: position.latitude,
                    longitude: position.longitude,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = response.json();
            console.log("Position sent successfully");
        } catch (error) {
            console.error("Error sending position:", error);
        }
    };

    const [deviceUUID, setDeviceUUID] = useState(null);

    const fetchOrGenerateUUID = async () => {
        try {
            const storedUUID = await AsyncStorage.getItem('deviceID');
            if (storedUUID == null) {
                let newUUID = uuid.v4();
                await AsyncStorage.setItem('deviceID', newUUID)
                console.log(newUUID)
                setDeviceUUID(newUUID);
            }
            else {
                setDeviceUUID(storedUUID);
            }
        } catch (error) {
            console.error("Error retrieving UUID:", error);
        }
    };

    const [position, setPosition] = useState(null);

    const getCurrent = () => {
        Geolocation.getCurrentPosition(
            (pos) => {
                const newPosition = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    altitude: pos.coords.altitude,
                    latitudeDelta: 0.0000001,
                    longitudeDelta: 0.0000001,
                };
                setPosition(newPosition);
                console.log(devicePositions)
                if (deviceUUID && newPosition) {
                    checkDeviceExists(deviceUUID)
                    sendPositionToServer(deviceUUID, newPosition)
                }
            },
            (error) => Alert.alert('error', JSON.stringify(error)),
            {
                maximumAge: 0,
                enableHighAccuracy: true,
            }
        )
    };

    useEffect(() => {

        //console.log(devicePositions);

        //getCurrent();
        fetchOrGenerateUUID();
        const intervalId = setInterval(() => {
            fetchDevicePositions().then(poss => {
                if (poss) setDevicePositions(poss);
            });
            getCurrent();
            //console.log(devicePositions);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [devicePositions]);


    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <ScrollView>
                    {devicePositions.map(device => (
                        <View key={device.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                            <Text>ID: {device.id}</Text>
                            <Text>Device ID: {device.device_id}</Text>
                            <Text>Latitude: {device.latitude}</Text>
                            <Text>Longitude: {device.longitude}</Text>
                            <Text>Actual Session: {device.actual_session}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <MapView
                style={styles.map}
                initialRegion={ position }
                region={position}>
                {position && devicePositions.map(device => (
                    <Marker
                        key={device.id}
                        coordinate={{
                            latitude: device.latitude,
                            longitude: device.longitude,
                        }}
                        title={`Device ID: ${device.device_id}`}
                    >
                        <View
                            style={{ backgroundColor: 'red', padding: 2, borderRadius: 10 }}
                        ></View>
                    </Marker>
                )) /* (
                    <Marker
                        coordinate={position}
                        title='mi pos'>

                        <View
                            style={{ backgroundColor: 'red', padding: 5, borderRadius: 10 }}
                        ></View>
                    </Marker>
                ) */}
            </MapView>
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
    map: {
        width: '100%',
        flex: 0.4,
    },
    container2: {
        flex: 0.5,
        borderColor: 'black',
        borderWidth: 2,
        width: '100%'
    }
})

export default App;
