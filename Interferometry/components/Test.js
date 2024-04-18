import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { CarouselImagesGuest } from './CarouselImages';
import { sent, fetchDevicePositions, fetchReferencePoint } from '../services/deviceService';

const Map = () => {
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        latitudeDelta: 0.0000001,
        longitudeDelta: 0.0000001,
    });
    const [devicePositions, setDevicePositions] = useState([]);
    const [referencePoint, setReferencePoint] = useState(null);


    useEffect(() => {

        const continuousFetch = async () => {
            while (true) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const poss = await fetchDevicePositions();
                    if (poss) setDevicePositions(poss);
                    const point = await fetchReferencePoint();
                    if (point) setReferencePoint(point);

                } catch (error) {
                    console.error("Error durante la obtención de los posiciones de los dispositivos.", error);
                }
            }
        };

        continuousFetch();

        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, altitude } = position.coords;
                setRegion((prevRegion) => ({
                    ...prevRegion,
                    latitude,
                    longitude,
                    altitude,
                }));
                //console.log(position.coords)
                sent(latitude, longitude, altitude);
            },
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 0,
                maximumAge: 1000,
                interval: 4000
            }
        );


        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            showsUserLocation={false}
            followsUserLocation={false}
        >
            {devicePositions.map(device => (
                <Marker
                    key={device.device_id}
                    coordinate={{
                        latitude: device.latitude,
                        longitude: device.longitude,
                    }}
                >
                    <View style={styles.marker}></View>
                </Marker>
            ))}
            {/* <Marker coordinate={region} title="Mi Posición" pinColor="green" /> */}
        </MapView>
    );

}

export function Test() {

    return (
        <View style={styles.container}>
            {(
                <CarouselImagesGuest></CarouselImagesGuest>
            )}

            <Map></Map>

        </View>
    )
};

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
    },
    map: {
        width: '100%',
        flex: 0.3,
    },
    marker: {
        backgroundColor: 'red',
        padding: 2,
        borderRadius: 10
    },
})
