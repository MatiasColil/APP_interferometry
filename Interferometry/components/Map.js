import Geolocation from '@react-native-community/geolocation';
import * as device from '../services/deviceService'
import { fetchDevicePositions, fetchOrGenerateUUID, fetchGroupID } from '../services/deviceService'
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceList from '../components/DeviceList';
import DeviceMap from '../components/DeviceMap';

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
                    device.checkDeviceExists(deviceUUID);
                    device.sendPositionToServer(deviceUUID, newPosition);
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

    const [deviceUUID, setDeviceUUID] = useState(null);

    const [position, setPosition] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchOrGenerateUUID().then(uuid => {
                setDeviceUUID(uuid);
            });
            fetchDevicePositions().then(poss => {
                if (poss) setDevicePositions(poss);
            });

            getCurrent(deviceUUID)
                .then(setPosition);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [devicePositions]);

    console.log("----DEVICE ID----")
    console.log(deviceUUID)
    console.log("--------------")
    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <DeviceList devicePositions={devicePositions} />
            </View>
            <DeviceMap position={position} devicePositions={devicePositions} />
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