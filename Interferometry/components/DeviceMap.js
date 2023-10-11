import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function DeviceMap({ position, devicePositions }) {
    return (
        <MapView
            style={styles.map}
            initialRegion={position}
            region={position}>
            {position && devicePositions.map(device => (
                <Marker
                    key={device.id}
                    coordinate={{
                        latitude: device.latitude,
                        longitude: device.longitude,
                    }}
                    title={`Device ID: ${device.device_id}`}
                >
                    <View style={styles.marker}></View>
                </Marker>
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        flex: 0.4,
    },
    marker: {
        backgroundColor: 'red',
        padding: 2,
        borderRadius: 10
    }
});

export default DeviceMap;
