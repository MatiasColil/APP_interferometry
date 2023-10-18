import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchDevicePositions, sendJSON, sendRefPoint } from '../services/deviceService';
import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';

function Map({ devicePositions, onMapPress, referencePoint }) {

    const initial = {
        latitude: devicePositions[0]?.latitude || 0,
        longitude: devicePositions[0]?.longitude || 0,
        latitudeDelta: 0.0000001,
        longitudeDelta: 0.0000001,
    }
    return (
        <MapView
            style={styles.map}
            initialRegion={initial}
            region={initial}
            onPress={onMapPress}
        >
            {
                devicePositions.map(device => (
                    <Marker
                        key={device.id}
                        coordinate={{
                            latitude: device.latitude,
                            longitude: device.longitude,
                        }}
                        title={`Device ID: ${device.device_id}`}
                    >
                        <View style={styles.marker}></View>
                    </Marker>
                ))
            }
            {
                referencePoint && (
                    <Marker coordinate={referencePoint}>
                        <View style={styles.marker}></View>
                    </Marker>
                )
            }
        </MapView>
    );
}


export function AdminView() {
    const [devicePositions, setDevicePositions] = useState([]);
    const [selectingReferencePoint, setSelectingReferencePoint] = useState(false);
    const [referencePoint, setReferencePoint] = useState(null);

    const handleDefineReferencePoint = () => {
        setSelectingReferencePoint(true);
    };

    const handleMapPress = (event) => {
        if (selectingReferencePoint) {
            const { latitude, longitude } = event.nativeEvent.coordinate;

            Geolocation.getCurrentPosition(
                position => {
                    const altitude = position.coords.altitude;
                    setReferencePoint({ latitude, longitude, altitude });
                    Alert.alert('', 'Punto de referencia definido.');
                    console.log(altitude)
                    const refPoint = {
                        latitude : latitude,
                        longitude : longitude,
                        altitude : altitude,
                    };
                    console.log(refPoint);
                    sendRefPoint(refPoint);
                    setSelectingReferencePoint(false);
                },
                error => {
                    console.error("Error obteniendo altitud: ", error);
                },
                { enableHighAccuracy: true }
            );
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchDevicePositions().then(poss => {
                if (poss) setDevicePositions(poss);
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [devicePositions]);
    return (
        <View style={styles.container}>
            <Map devicePositions={devicePositions} onMapPress={handleMapPress} referencePoint={referencePoint} />
            <View style={styles.button}>
                <Button title="Definir punto de referencia" onPress={handleDefineReferencePoint} />
                <Button title="Realizar simulación" onPress={sendJSON}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        flex: 0.4,
    },
    marker: {
        backgroundColor: 'red',
        padding: 2,
        borderRadius: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%'
    }
});