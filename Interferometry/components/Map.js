import Geolocation from '@react-native-community/geolocation';
import * as device from '../services/deviceService'

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
