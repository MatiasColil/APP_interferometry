import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const simulation = async () => {
    const storeGroupID = await AsyncStorage.getItem('selectedGroup');
    const positions = await fetch(`http://10.0.2.2:8000/api/register/?actual_group=${storeGroupID}`);
    const refPoint = await fetch(`http://10.0.2.2:8000/api/ref/${storeGroupID}`);
    const dataPos = await positions.json();
    const dataRef = await refPoint.json();
    try{
        const response = await fetch('http://10.0.2.2:8000/api/simulation/', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                locations : dataPos,
                reference : dataRef,
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
            const blob = await response.blob()
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                return base64data;
            }
        }

    } catch (error){
        console.error("Error:", error);
    }
}

export const fetchDevicePositions = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/register/?actual_group=${storeGroupID}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener posiciones:', error);
        return null;
    }
};

export const fetchReferencePoint = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/ref/${storeGroupID}/`);
        if (response.ok){
            const data = await response.json();
            return data
        }
        else{
            return null
        }
    } catch (error) {
        console.error('Error al obtener posiciones:', error);
    }
}

export const checkDeviceExists = async (uuid) => {
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/register/${uuid}/`);
        if (response.ok) {
            return true
        }
        if (response.status === 404) {
            return false;
        }
        throw new Error('error');
    } catch (error) {
        console.error("Error checking device existence:", error);
        return false;
    }
};

export const checkRefPointExist = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/ref/${storeGroupID}/`);
        if (response.ok) {
            return true
        }
        if (response.status === 404) {
            return false;
        }
        throw new Error('error');
    } catch (error) {
        console.error("Error checking reference point existence:", error);
        return false;
    }
}

export const sendDistance = async (entitie) => {
    try{
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        let string = `http://10.0.2.2:8000/api/register/${ entitie.device_id + "/"}`
        const response = await fetch(string, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: entitie.device_id,
                latitude: entitie.latitude,
                longitude: entitie.longitude,
                altitude: entitie.altitude,
                actual_group: storeGroupID,
                distance: entitie.distance
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("Distancia actualizada")
    } catch (error) {
        console.error("Error sending position:", error);
    }
};

export const sendToken = async (uuid, token) => {
    try{
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
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
                altitude: 0,
                longitude: 0,
                latitude: 0,
                tokenFCM: token,
                actual_group: storeGroupID
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //console.log("Token actualizado")
    } catch (error) {
        console.error("Error sending position:", error);
    }
};

export const sendPositionToServer = async (uuid, position) => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
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
                altitude: position.altitude,
                actual_group: storeGroupID,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        //console.log("Position sent successfully");
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

export const isTokenValid = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');

        if (!token) {
            return false;
        }

        const response = await fetch('http://10.0.2.2:8000/api/auth/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        });

        return response.ok;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};

export const fetchGroups = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8000/api/groups/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        return null;
    }
}

export const fetchGroupID = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        if (storeGroupID != null) {
            return storeGroupID;
        }
    } catch (error) {
        console.error("Error retrieving Group ID", error);
    }
}

export const createNewGroup = async (name) => {
    try {
        const response = await fetch('http://10.0.2.2:8000/api/groups/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Group: name
            })
        });

        if (response.ok) {
            const data = await response.json()
            await AsyncStorage.removeItem('selectedGroup');
            await AsyncStorage.setItem('selectedGroup', data.id.toString());
            console.log("Posición creada y guardada.")
        }
        else {
            throw new Error('Network response was not ok')
        }
    } catch (error) {
        console.error("Error al crear el grupo: ", error);
    }
}

export const sendRefPoint = async (refPoint) => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        let exist = await checkRefPointExist();
        let metodo = exist ? 'PUT' : 'POST';
        let string = `http://10.0.2.2:8000/api/ref/${exist ? storeGroupID + "/" : ""}`
        const response = await fetch(string, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                altitude: refPoint.altitude,
                latitude: refPoint.latitude,
                longitude: refPoint.longitude,
                actual_group: storeGroupID,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log("Reference point sent successfully");
    } catch (error) {
        console.error("Error sending reference point:", error);
    }
}