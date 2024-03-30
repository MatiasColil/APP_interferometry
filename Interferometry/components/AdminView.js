import { View, Text, Button, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchDevicePositions, callSimulation, sendRefPoint, sendDistance, sendParameters, simulation } from '../services/deviceService';
import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { CarouselImagesAdmin, CarouselImagesSimu } from './CarouselImages';

function Map({ devicePositions, onMapPress, referencePoint, posAdmin }) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [inputDistance, setInputDistance] = useState('');
    
    /* const handleMarkerPress = (device) => {
        setSelectedDevice(device);
        setModalVisible(false);
        navigator
    }; */

    /* const handleSave = () => {
        const updatedDevice = {
            ...selectedDevice,
            distance: parseFloat(inputDistance)
        };
        sendDistance(updatedDevice);
        setModalVisible(false);
    }; */

    const initial = {
        latitude: referencePoint?.latitude || posAdmin.latitude,
        longitude: referencePoint?.longitude || posAdmin.longitude,
        latitudeDelta: 0.0000001,
        longitudeDelta: 0.0000001,
    };

    return (
        <>
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
                        >
                            <View style={styles.marker}></View>
                        </Marker>
                    ))
                }
                {
                    referencePoint && (
                        <Marker coordinate={referencePoint}>
                            <View style={styles.markerAdmin}></View>
                        </Marker>
                    )
                }
            </MapView>

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <TextInput
                            value={inputDistance}
                            onChangeText={setInputDistance}
                            placeholder="Ingrese la nueva distancia"
                            keyboardType="numeric"
                        />
                        <Button title="Guardar" onPress={handleSave} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal> */}

        </>
    );
}

export function AdminView() {
    const [devicePositions, setDevicePositions] = useState([]);
    const [selectingReferencePoint, setSelectingReferencePoint] = useState(false);
    const [referencePoint, setReferencePoint] = useState(null);
    const [isSimulationModalVisible, setSimulationModalVisible] = useState(false);
    const [activeImageId, setActiveImageId] = useState(null);
    const [observationTime, setObservationTime] = useState('');
    const [samplingTime, setSamplingTime] = useState('');
    const [declination, setDeclination] = useState('');
    const [simulatedImages, setSimulatedImages] = useState(null);
    const [frequency, setFrequency] = useState('');
    const [scale, setScale] = useState('');
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        latitudeDelta: 0.0000001,
        longitudeDelta: 0.0000001,
    });

    /* const getCurrent = async () => {
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
    }; */

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
                    const refPoint = {
                        latitude: latitude,
                        longitude: longitude,
                        altitude: altitude,
                    };
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

    const formSimulation = () => {
        setSimulationModalVisible(true);
    };

    const performSimulation = async () => {
        const send = await sendParameters(observationTime, samplingTime, declination, activeImageId, frequency, scale);
        const sim = await simulation(observationTime, samplingTime, declination, frequency, scale, activeImageId);
        setSimulatedImages(sim);
        setSimulationModalVisible(false);
    };

    useEffect(() => {

        const watchId = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, altitude } = position.coords;
                setCurrentLocation((prevRegion) => ({
                    ...prevRegion,
                    latitude,
                    longitude,
                    altitude,
                }));
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

        const continuousFetch = async () => {
            while (true) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const poss = await fetchDevicePositions();
                    if (poss) setDevicePositions(poss);

                } catch (error) {
                    console.error("Error durante la obtención de los posiciones de los dispositivos.", error);
                }
            }
        };

        continuousFetch();

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);
    return (
        <View style={styles.container}>
            {simulatedImages ? (
                <CarouselImagesSimu simImages={simulatedImages} ></CarouselImagesSimu>
            ) : (
                <CarouselImagesAdmin onActiveItemChange={setActiveImageId}></CarouselImagesAdmin>
            )
            }
            {currentLocation && <Map devicePositions={devicePositions}
            onMapPress={handleMapPress} 
            referencePoint={referencePoint} 
            posAdmin={currentLocation} />}
            <View style={styles.button}>
                <Button title="Definir punto de referencia" onPress={handleDefineReferencePoint} />
                <Button title="Realizar simulación" onPress={formSimulation} />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isSimulationModalVisible}
                onRequestClose={() => {
                    setSimulationModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Realizar simulación</Text>

                        <TextInput placeholder="Tiempo de observación en horas" placeholderTextColor={'black'} style={styles.inputField} onChangeText={setObservationTime} />
                        <TextInput placeholder="Tiempo de muestreo en minutos" placeholderTextColor={'black'} style={styles.inputField} onChangeText={setSamplingTime} />
                        <TextInput placeholder="Declinación en grados" placeholderTextColor={'black'} style={styles.inputField} onChangeText={setDeclination} />
                        <TextInput placeholder="Frecuencia en Gigahertz" placeholderTextColor={'black'} style={styles.inputField} onChangeText={setFrequency} />
                        <TextInput placeholder="Escala" placeholderTextColor={'black'} style={styles.inputField} onChangeText={setScale} />

                        <Text style={{color: 'black'}} >ID de imagen activa: {activeImageId}</Text>
                        <Button title="Cerrar" onPress={() => setSimulationModalVisible(false)} />
                        <Button title='Iniciar simulación' onPress={performSimulation}></Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        flex: 0.3,
    },
    marker: {
        backgroundColor: 'red',
        padding: 2,
        borderRadius: 10
    },
    markerAdmin: {
        backgroundColor: 'blue',
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold'
    },
    inputField: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        color: 'black'
    }

});