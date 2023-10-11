import React from 'react';
import { View, Text, ScrollView} from 'react-native';

function DeviceList({ devicePositions }) {
    return (
        <ScrollView>
            {devicePositions.map(device => (
                <View key={device.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                    <Text>ID: {device.id}</Text>
                    <Text>Device ID: {device.device_id}</Text>
                    <Text>Latitude: {device.latitude}</Text>
                    <Text>Longitude: {device.longitude}</Text>
                    <Text>Actual Session: {device.actual_session}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

export default DeviceList;
