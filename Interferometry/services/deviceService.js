import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const fetchDevicePositions = async () => {
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/register/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener posiciones:', error);
        return null;
    }
};

export const checkDeviceExists = async (uuid) => {
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

export const sendPositionToServer = async (uuid, position) => {
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

export const fetchOrGenerateUUID = async () => {
    try {
        const storedUUID = await AsyncStorage.getItem('deviceID');
        if (storedUUID == null) {
            let newUUID = uuid.v4().toString();
            await AsyncStorage.setItem('deviceID', newUUID)
            return newUUID;
        }
        else {
            return storedUUID;
        }
    } catch (error) {
        console.error("Error retrieving UUID:", error);
    }
};