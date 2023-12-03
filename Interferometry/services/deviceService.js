import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const simulation = async (obsTime, samplingTime, declination, frequency, scale,activeImageId) => {
    const storeGroupID = await AsyncStorage.getItem('selectedGroup');
    const positions = await fetch(`http://10.0.2.2:8000/api/register/?actual_group=${storeGroupID}`);
    const refPoint = await fetch(`http://10.0.2.2:8000/api/ref/${storeGroupID}/`);
    const dataPos = await positions.json();
    const dataRef = await refPoint.json();
    try {
        const response = await fetch('http://10.0.2.2:8000/api/simulation/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                locations: dataPos,
                reference: dataRef,
                parameter: {
                    "observationTime": obsTime,
                    "declination": declination,
                    "samplingTime": samplingTime,
                    "frequency": frequency,
                    "scale": scale,
                    "idPath": activeImageId
                }
            }),
        });
        if (!response.ok) {
            throw new Error('Error simulación.');
        }
        else {
            const data = response.json();
            return data;
        }

    } catch (error) {
        console.error("Error:", error);
    }
};

export const sendParameters = async (obsTime, samplingTime, declination, activeImageId, frequency, scale) => {
    const storeGroupID = await AsyncStorage.getItem('selectedGroup');
    let exist = await checkParametersExist();
    let metodo = exist ? 'PUT' : 'POST';
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/parameters/${exist ? storeGroupID + "/" : ""}`, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                observationTime: obsTime,
                declination: declination,
                samplingTime: samplingTime,
                frequency:  frequency,
                idPath: activeImageId,
                groupId: storeGroupID,
                scale: scale
            }),
        });
        if (!response.ok) {
            throw new Error('error envío de parametros');
        }
        else {
            const data = response.json();
            return data;
        }

    } catch (error) {
        console.error("Error:", error);
    }
};

export const fetchParameters = async () => {
    try{
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/parameters/${storeGroupID}/`);
        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            console.log(response);
            throw new Error('Error fetch parameters: ');
        }
    }
    catch(error) {
        console.error("error:", error);
    }
};

export const callSimulation = async () => {
    const storeGroupID = await AsyncStorage.getItem('selectedGroup');
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/message/?actual_group=${storeGroupID}`)
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error("Error:", error)
    }
};

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
        if (response.ok) {
            const data = await response.json();
            return data
        }
        else {
            return null
        }
    } catch (error) {
        console.error('Error al obtener ref point:', error);
    }
};

export const checkDeviceExists = async (uuid) => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/register/?device_id=${uuid}&actual_group=${storeGroupID}`);
        if (response.ok) {
            return true
        }
        if (response.status === 404) {
            console.log("no encontro el device")
            return false;
        }
    } catch (error) {
        console.error("no encontro el device catch:", error);
        return null;
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
        throw new Error('error check ref point');
    } catch (error) {
        console.error("error checkeando ref point:", error);
        return false;
    }
}

export const checkParametersExist = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/parameters/${storeGroupID}/`);
        if (response.ok) {
            return true
        }
        if (response.status === 404) {
            return false;
        }
        throw new Error('error check parameters exist');
    } catch (error) {
        console.error("error checkeando parameter exist:", error);
        return false;
    }
}

export const sendDistance = async (entitie) => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        let string = `http://10.0.2.2:8000/api/register/${entitie.device_id + "/"}`
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
            throw new Error('error enviando distancia');
        }
        console.log("Distancia actualizada")
    } catch (error) {
        console.error("error enviando distancia catch:", error);
    }
};

export const sendToken = async (uuid, token) => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/register/${uuid}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: uuid,
                latitude: 0,
                longitude: 0,
                altitude: 0,
                actual_group: storeGroupID,
                tokenFCM: token
            }),
        });

        if (!response.ok) {
            const response2 = await fetch(`http://10.0.2.2:8000/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: uuid,
                    latitude: 0,
                    longitude: 0,
                    altitude: 0,
                    actual_group: storeGroupID,
                    tokenFCM: token
                }),
            });
            if (!response2.ok) {
                console.log("error enviando token pos")
            }
        }
    } catch (error) {
        console.error("Error enviando toke pos catch:", error);
    }
};

export const sendPositionToServer = async (uuid, position) => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(`http://10.0.2.2:8000/api/register/${uuid}/`, {
            method: 'PUT',
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
            const response2 = await fetch(`http://10.0.2.2:8000/api/register/`, {
                method: 'POST',
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
            if (!response2.ok) {
                console.log("error enviando pos")
            }
        }
    } catch (error) {
        console.error("error enviando pos catch:", error);
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
};

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
            console.log("Grupo creado.")
        }
        else {
            throw new Error('error creando grupo.')
        }
    } catch (error) {
        console.error("Error al crear el grupo: ", error);
    }
};

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
            throw new Error('error enviando punto de referencia');
        }
        console.log("punto de referencia enviado");
    } catch (error) {
        console.error("error enviando punto de referencia catch:", error);
    }
};

export const cleanGroup = async (storeGroupID) => {
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/register/delete_by_group/?actual_group=${storeGroupID}`, {
            method: 'DELETE'
        });
        console.log("borro dispositivos del grupo")
        if (!response.ok) {
            throw new Error('Error limpiando grupo.')
        }
    } catch (error) {
        console.error("error:", error)
    }
};

export const deleteGroup = async (storeGroupID) => {
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/groups/${storeGroupID}/`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar grupo.')
        }
    } catch (error) {
        console.error("error:", error)
    }
};

export const fetchImages = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8000/api/imagenes/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("error:", error);
    }

};