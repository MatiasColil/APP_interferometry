import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceList from './components/DeviceList';
import DeviceMap from './components/DeviceMap';
import { getCurrent } from './components/Map';
import { fetchDevicePositions, fetchOrGenerateUUID } from './services/deviceService'


function App() {

    const [devicePositions, setDevicePositions] = useState([]);

    const [deviceUUID, setDeviceUUID] = useState(null);

    const [position, setPosition] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchOrGenerateUUID().then(uuid => {
                setDeviceUUID(uuid);
            })
            fetchDevicePositions().then(poss => {
                if (poss) setDevicePositions(poss);
            });

            getCurrent(deviceUUID)
                .then(setPosition);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [devicePositions]);


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

export default App;
