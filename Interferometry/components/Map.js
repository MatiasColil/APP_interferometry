import Geolocation from '@react-native-community/geolocation';
import {
    fetchDevicePositions, fetchOrGenerateUUID, simulation, sendToken, fetchReferencePoint
    , sendPositionToServer, fetchImages, fetchParameters
} from '../services/deviceService'
import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import DeviceMap from './DeviceMap';
import messaging from '@react-native-firebase/messaging';
import { CarouselImagesGuest, CarouselImagesSimu } from './CarouselImages';


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

    const [devicePositions, setDevicePositions] = useState([]);
    const [simulatedImages, setSimulatedImages] = useState(null);
    const [position, setPosition] = useState(null);
    const [referencePoint, setReferencePoint] = useState(null);

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
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    await getCurrent(uuid).then(setPosition);
                    const poss = await fetchDevicePositions();
                    if (poss) setDevicePositions(poss);

                    const point = await fetchReferencePoint();
                    if (point) setReferencePoint(point);

                } catch (error) {
                    console.error("Error durante el bucle:", error);
                }
            }
        };

        continuousFetch();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            const param = await fetchParameters();
            const sim = await simulation(param.observationTime, param.samplingTime, param.declination, param.frequency, param.scale, param.idPath);
            setSimulatedImages(sim);
            console.log("Se realizó la simulación.")
        });
        return unsubscribe;

    }, []);
    return (
        <View style={styles.container}>
            {simulatedImages ? (
                <CarouselImagesSimu simImages={simulatedImages} ></CarouselImagesSimu>
            ) : (
                <CarouselImagesGuest></CarouselImagesGuest>
            )}
            <DeviceMap
                position={position}
                devicePositions={devicePositions}
                refPoint={referencePoint}
            />
        </View>
    );
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
    }
})