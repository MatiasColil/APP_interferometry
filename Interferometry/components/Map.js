import Geolocation from '@react-native-community/geolocation';
import {
    fetchDevicePositions, fetchReferencePoint
    , sendPosition, callSimulation
} from '../services/deviceService'
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import DeviceMap from './DeviceMap';
import messaging from '@react-native-firebase/messaging';
import { CarouselImagesGuest, CarouselImagesSimu } from './CarouselImages';



export function MapGuest() {

    const [devicePositions, setDevicePositions] = useState([]);
    const [simulatedButton, setSimulatedButton] = useState(false)
    const [simulatedImages, setSimulatedImages] = useState(null);
    const [referencePoint, setReferencePoint] = useState(null);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        latitudeDelta: 0.0000001,
        longitudeDelta: 0.0000001,
    });

    useEffect(() => {

        let isMounted = true;

        const continuousFetch = async () => {
            while (isMounted) {
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
                sendPosition(latitude, longitude, altitude);
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

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log("------------------------------------")
            console.log("IMAGENES RECIBIDAS IMAGENES RECIBIDAS IMAGENES RECIBIDAS IMAGENES RECIBIDAS")
            const images = await callSimulation();
            setSimulatedImages(images);
            setSimulatedButton(true);
            console.log("Se realizó la simulación.")
            console.log("------------------------------------")
        });


        return () => {
            Geolocation.clearWatch(watchId);
            isMounted = false
            unsubscribe();
        };

    }, []);

    return (
        <View style={styles.container}>
            {simulatedButton ? (
                <CarouselImagesSimu simImages={simulatedImages} ></CarouselImagesSimu>
            ) : (
                <CarouselImagesGuest></CarouselImagesGuest>
            )}
            <DeviceMap
                position={region}
                devicePositions={devicePositions}
                refPoint={referencePoint}
            />
            {simulatedButton ? (
                <View style={styles.buttonContainer}>
                    <Button title='Ver las imagenes modelo' onPress={() => setSimulatedButton(false)}></Button>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <Button title='Ver las imagenes de simulación' onPress={() => setSimulatedButton(true)}></Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
})