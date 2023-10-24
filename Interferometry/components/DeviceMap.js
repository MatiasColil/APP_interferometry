import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

function DeviceMap({ position, devicePositions, refPoint }) {

    const initial = {
        latitude: refPoint?.latitude || position?.latitude || 0,
        longitude: refPoint?.longitude || position?.longitude || 0,
        latitudeDelta: 0.0000001,
        longitudeDelta: 0.0000001,
    };

    return (
        <>
            <MapView
                style={styles.map}
                initialRegion={initial}
                region={initial}>
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
                {
                    refPoint && (
                        <Marker coordinate={refPoint}>
                            <View style={styles.markerRefpoint}></View>
                        </Marker>
                    )
                }
            </MapView>
        </>
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
    },
    markerRefpoint: {
        backgroundColor: 'blue',
        padding: 2,
        borderRadius: 10
    }
});

export default DeviceMap;
