import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';

function useGeolocation() {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            (position) => {
                setLocation(position);
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    return location;
}

export default useGeolocation;
