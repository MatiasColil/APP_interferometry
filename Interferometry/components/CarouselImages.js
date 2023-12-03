import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { fetchImages } from '../services/deviceService';

export function CarouselImagesAdmin({onActiveItemChange}) {
    const [images, setImages] = useState([]);

    const renderItem = ({ item }) => (
        <Image
            source={{ uri: item.archivo }}
            style={styles.image}
            resizeMode="contain"
        />
    );

    useEffect(() => {
        const fetchImg = async () => {
            const img = await fetchImages();
            setImages(img || []);
            if (img) {
                onActiveItemChange(img[0].id);
            }
        };
        fetchImg().then();
    }, []);

    return (
        <View style={styles.container}>
            {
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item) => item.id.toString()}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.floor(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                        if (images[index]) {
                            onActiveItemChange(images[index].id);
                        }
                    }}
                />
            }
        </View>
    );
};

export function CarouselImagesSimu( {simImages} ) {
    const renderItem = ({ item }) => (
        <Image
            source={{ uri: `data:image/png;base64,${item.img}`}}
            style={styles.image}
            resizeMode="contain"
        />
    );

    return (
        <View style={styles.container}>
            {
                <FlatList
                    data={simImages}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
        </View>
    );
};

export function CarouselImagesGuest() {
    const [images, setImages] = useState([]);

    const renderItem = ({ item }) => (
        <Image
            source={{ uri: item.archivo }}
            style={styles.image}
            resizeMode="contain"
        />
    );

    useEffect(() => {
        const fetchImg = async () => {
            const img = await fetchImages();
            setImages(img || []);
        };
        fetchImg().then();
    }, []);

    return (
        <View style={styles.container}>
            {
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.7,
        backgroundColor: 'white',
    },
    image: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
});