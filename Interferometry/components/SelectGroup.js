import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Button, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewGroup, fetchGroups } from "../services/deviceService";


export function SelectGroupGuest({ navigation }) {

    const selectGroup = async (groupID) => {
        try {
            await AsyncStorage.setItem('selectedGroup', groupID.toString());
            navigation.navigate('Map');
        } catch (error) {
            console.error('Error al guardar el grupo seleccionado:', error);
        }
    };

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroups().then(groups => {
            if (groups) setGroups(groups);
        });
    }, []);

    return (
        <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <Text style={styles.groupName}>{item.Group}</Text>
                    <Button title="Seleccionar" onPress={() => selectGroup(item.id)} />
                </View>
            )}
        />
    );

}

export function SelectGroupAdmin({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    const selectGroup = async (groupID) => {
        try {
            await AsyncStorage.setItem('selectedGroup', groupID.toString());
            navigation.navigate('True');
        } catch (error) {
            console.error('Error al guardar el grupo seleccionado:', error);
        }
    };

    const handleAddGroup = () => {
        createNewGroup(newGroupName);
        setModalVisible(false);
        navigation.navigate('True');
    };

    useEffect(() => {
        fetchGroups().then(groups => {
            if (groups) setGroups(groups);
        });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerText}>Nombre del grupo</Text>
                        <Text style={styles.headerText}>Última vez utilizado (horas)</Text>
                        <View style={{ width: 100 }} />
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                        <View style={styles.tableDataContainer}>
                            <Text style={styles.tableCell}>{item.Group}</Text>
                            <Text style={styles.tableCell}>{Math.round(item.last_time_used)}</Text>
                        </View>
                        <Button title="Seleccionar" onPress={() => selectGroup(item.id)} />
                    </View>
                )}
            />
            <Button title="Crear nuevo grupo" onPress={() => setModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisible(!isModalVisible);
                }}>
                <View style={styles.modalView}>
                    <TextInput
                        placeholder="Nombre del Grupo"
                        value={newGroupName}
                        onChangeText={setNewGroupName}
                        style={styles.input}
                    />
                    <Button title="Agregar" onPress={handleAddGroup} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
    },
    tableDataContainer: {
        flexDirection: 'row',
        flex: 1
    },
    tableCell: {
        flex: 1
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        backgroundColor: 'white',
        elevation: 5
    },
    input: {
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
    },
    groupName: {
        fontSize: 16,
    },
});