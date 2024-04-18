import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import messaging from '@react-native-firebase/messaging';


//const API_BASE_URL = 'http://10.0.2.2:8000';
const API_BASE_URL ='http://www.interferometryapp.com';


export const simulation = async (obsTime, samplingTime, declination, frequency, scale, activeImageId, scheme, robust_param) => {
    const storeGroupID = await AsyncStorage.getItem('selectedGroup');

    try {
        console.log("-------------------------------------------------------")
        console.log(scheme)
        console.log("-------------------------------------------------------")
        const response = await fetch(API_BASE_URL + '/api/simuadmin/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parameter: {
                    "observationTime": obsTime,
                    "declination": declination,
                    "samplingTime": samplingTime,
                    "frequency": frequency,
                    "scale": scale,
                    "idPath": activeImageId,
                    "scheme": scheme,
                    "robust_param": robust_param
                },
                "actual_group": storeGroupID
            }),
        });
        if (!response.ok) {
            console.log("----------------")
            console.log("response simulation error")
            const data = await response.json();
            console.log(data)
            throw new Error('Error simulación.');
        }
        else {
            const data = await response.json();
            console.log("error simulacion admin")
            return data;
        }

    } catch (error) {
        console.error("Error simulación catch:", error);
    }
};

export const sendParameters = async (obsTime, samplingTime, declination, activeImageId, frequency, scale, scheme, robust_param) => {
    const storeGroupID = await AsyncStorage.getItem('selectedGroup');
    let exist = await checkParametersExist();
    let metodo = exist ? 'PUT' : 'POST';
    try {
        const response = await fetch(API_BASE_URL + `/api/parameters/${exist ? storeGroupID + "/" : ""}`, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                observationTime: obsTime,
                declination: declination,
                samplingTime: samplingTime,
                frequency: frequency,
                idPath: activeImageId,
                groupId: storeGroupID,
                scale: scale,
                scheme: scheme,
                robust_param: robust_param
            }),
        });
        if (!response.ok) {
            throw new Error('error envío de parametros');
        }
        else {
            const data = await response.json();
            console.log("send parameters 200")
            return data;
        }

    } catch (error) {
        console.error("Error send parameters:", error);
    }
};

export const fetchParameters = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(API_BASE_URL + `/api/parameters/${storeGroupID}/`);
        if (response.ok) {
            const data = await response.json();
            console.log("retrieve parameters 200")
            return data;
        }
        else {
            console.log(response);
            throw new Error('Error fetch parameters: ');
        }
    }
    catch (error) {
        console.error("error:", error);
    }
};

export const callSimulation = async () => {

    const storeGroupID = await AsyncStorage.getItem('selectedGroup');
    try {
        const response = await fetch(API_BASE_URL + `/api/simulation/?actual_group=${storeGroupID}`)
        if (response.ok) {
            const data = await response.json();
            console.log("Simulación de invitados realizada correctamente.")
            return data
        }
    } catch (error) {
        console.error("Error simulación invitados:", error)
    }
};

export const fetchDevicePositions = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(API_BASE_URL + `/api/register/?actual_group=${storeGroupID}`);
        const data = await response.json();
        console.log("retrieve device positions 200")
        return data;
    } catch (error) {
        console.error('Error al obtener posiciones:', error);
        return null;
    }
};

export const fetchReferencePoint = async () => {
    try {
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(API_BASE_URL + `/api/ref/${storeGroupID}/`);
        if (response.ok) {
            const data = await response.json();
            console.log("retrieve refpoint 200")
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
        const response = await fetch(API_BASE_URL + `/api/register/?device_id=${uuid}&actual_group=${storeGroupID}`);
        if (response.ok) {
            console.log(`Se verifica que existe device para el grupo ${storeGroupID}$ con uuid: ${uuid}$`)
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
        const response = await fetch(API_BASE_URL + `/api/ref/${storeGroupID}/`);
        if (response.ok) {
            console.log(`Se verifica que existe refpoint para el grupo ${storeGroupID}$`)
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
        const response = await fetch(API_BASE_URL + `/api/parameters/${storeGroupID}/`);
        if (response.ok) {
            console.log(`Se verifica que existen parametros para el grupo ${storeGroupID}$`)
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
        let string = API_BASE_URL + `/api/register/${entitie.device_id + "/"}`
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

export const sendToken = async () => {
    try {
        const uuid = await fetchOrGenerateUUID();
        const token = await messaging().getToken();
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(API_BASE_URL + `/api/register/${uuid}/`, {
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
            const response2 = await fetch(API_BASE_URL + `/api/register/`, {
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
                console.log("Error creando dispositivo con UUID y TOKEN")
            }
        }
    } catch (error) {
        console.error("Error actualizando dipositivo con UUID y TOKEN:", error);
    }
};

export const fetchOrGenerateUUID = async () => {
    try {
        const storedUUID = await AsyncStorage.getItem('deviceID');
        if (storedUUID == null) {
            let newUUID = uuid.v4().toString();
            await AsyncStorage.setItem('deviceID', newUUID)
            console.log("Se creo correctamente el token unico de dispositivo")
            return newUUID;
        }
        else {
            console.log("Se restauro correctamente el token unico de dispositivo")
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
        console.log("verify token admin")
        const response = await fetch(API_BASE_URL + '/api/auth/verify/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        });

        if (response.ok) {
            console.log("Se envió correctamente el token admin")
            return true
        }
        else {
            console.log("error token admin")
            return false
        }

    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
};

export const fetchGroups = async () => {
    try {
        const response = await fetch(API_BASE_URL + '/api/groups/');
        const data = await response.json();
        console.log("Se trajo correctamente los grupos")
        return data;
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        return null;
    }
};

export const createNewGroup = async (name) => {
    try {
        const response = await fetch(API_BASE_URL + '/api/groups/', {
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
        let string = API_BASE_URL + `/api/ref/${exist ? storeGroupID + "/" : ""}`
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
        const response = await fetch(API_BASE_URL + `/api/register/delete_by_group/?actual_group=${storeGroupID}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error limpiando grupo.')
        }
        console.log("borro dispositivos del grupo")
    } catch (error) {
        console.error("error clean grupos:", error)
    }
};

export const deleteGroup = async (storeGroupID) => {
    try {
        const response = await fetch(API_BASE_URL + `/api/groups/${storeGroupID}/`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar grupo.')
        }
        console.log("Se elimino correctamente el grupo")
    } catch (error) {
        console.error("error delete:", error)
    }
};

export const fetchImages = async () => {
    try {
        const response = await fetch(API_BASE_URL + '/api/imagenes/');
        const data = await response.json();
        console.log("Se trajo correctamente las imagenes")
        return data;
    } catch (error) {
        console.error("error fetch images:", error);
    }

};

export const login = async (username, password) => {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            await AsyncStorage.setItem('accessToken', data.access);
            return true;
        } else {
            const errorData = await response.json();
            console.log(errorData.detail);
            return false;
        }
    } catch (error) {
        console.error('Error:', error, response);
    }
};

export const sendPosition = async (latitude, longitude, altitude) => {
    try {
        const uuid = await fetchOrGenerateUUID();
        const token = await messaging().getToken();
        const storeGroupID = await AsyncStorage.getItem('selectedGroup');
        const response = await fetch(API_BASE_URL + `/api/register/${uuid}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: uuid,
                latitude: latitude,
                longitude: longitude,
                altitude: altitude,
                actual_group: storeGroupID,
                distance: 0,
                tokenFCM:token,
            }),
        });
        if (response.ok) {
            console.log("Se hizo un PUT (MODIFICAR) de posición dispositivo")
        }
        if (!response.ok) {
            const response2 = await fetch(API_BASE_URL + `/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: uuid,
                    latitude: latitude,
                    longitude: longitude,
                    altitude: altitude,
                    actual_group: storeGroupID,
                    distance: 0,
                    tokenFCM:token
                }),
            });
            if (!response2.ok) {
                console.log("Error creando datos de posisición del dispositivo (IF response2)")
            }
            else {
                console.log("Se hizo un POST (CREAR) de posición dispositivo")
            }
        }
    } catch (error) {
        console.error("Error en modificación de posición del dispositivo. (CATCH)", error);
    }
};

export const handleLogin = async (username, password) => {
    try {
        const response = await fetch(API_BASE_URL + `/api/auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            await AsyncStorage.setItem('accessToken', data.access);
            navigation.navigate('GroupAdmin');
        } else {
            const errorData = await response.json();
            alert(errorData.detail);
        }
    } catch (error) {
        console.error('Error:', error, response);
    }
};