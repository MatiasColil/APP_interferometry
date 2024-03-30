import { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, Button, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewGroup, fetchGroups, cleanGroup, deleteGroup, sendToken } from "../services/deviceService";


export function SelectGroupGuest({ navigation }) {

    const selectGroup = async (groupID) => {
        try {
            await AsyncStorage.setItem('selectedGroup', groupID.toString());
            console.log(groupID);
            navigation.navigate('Simulación');
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
    const [isModalVisibleClean, setModalVisibleClean] = useState(false);
    const [isModalVisibleDelete, setModalVisibleDelete] = useState(false);

    const selectGroup = async (groupID) => {
        try {
            await AsyncStorage.setItem('selectedGroup', groupID.toString());
            navigation.navigate('Simulación administrador');
        } catch (error) {
            console.error('Error al guardar el grupo seleccionado:', error);
        }
    };

    const handleAddGroup = () => {
        createNewGroup(newGroupName);
        setModalVisible(false);
        navigation.navigate('Simulación administrador');
    };

    const handleCleanGroup = (groupID) => {
        cleanGroup(groupID);
        console.log("Limpiando grupo con ID:", groupID);
        setModalVisibleClean(false);
    };

    const handleDeleteGroup = (groupID) => {
        deleteGroup(groupID);
        console.log("Eliminando grupo con ID:", groupID);
        setModalVisibleDelete(false);
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
                        <Text style={styles.headerText} >Nombre del grupo</Text>
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
            <View style={styles.buttonContainer}>
                <Button title="Nuevo grupo" onPress={() => setModalVisible(true)} />
                <Button title="Limpiar grupo" onPress={() => setModalVisibleClean(true)}></Button>
                <Button title="Eliminar grupo" onPress={() => setModalVisibleDelete(true)}></Button>
            </View>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisible(!isModalVisible);
                }}>
                <View style={styles.modalView}>
                    <TextInput
                        placeholder=" Nombre del Grupo"
                        onChangeText={setNewGroupName}
                        style={styles.input}
                        placeholderTextColor={'black'}
                    />
                    <Button title="Agregar" onPress={handleAddGroup} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} color={'gray'}/>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisibleClean}
                onRequestClose={() => {
                    setModalVisibleClean(!isModalVisibleClean);
                }}>
                <View style={styles.modalView}>
                    {groups.map((group) => (
                        <Button key={group.id} title={`Limpiar ${group.Group}`} onPress={() => handleCleanGroup(group.id)} />
                    ))}
                    <View style={styles.modalButton}>
                        <Button title="Atras" color={'grey'} onPress={() => setModalVisibleClean(false)}></Button>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisibleDelete}
                onRequestClose={() => {
                    setModalVisibleDelete(!isModalVisibleDelete);
                }}>
                <View style={styles.modalView}>
                    {groups.map((group) => (
                        <Button key={group.id} title={`Eliminar ${group.Group}`} onPress={() => handleDeleteGroup(group.id)} />
                    ))}
                    <View style={styles.modalButton}>
                        <Button title="Atras" color={'grey'} onPress={() => setModalVisibleDelete(false)}></Button>
                    </View>
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
        fontSize: 16,
        color:'black'
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
        flex: 1,
    },
    tableCell: {
        flex: 1,
        color:'black'
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        backgroundColor: 'white',
        elevation: 5
    },
    modalButton: {
        marginTop: 30,

    },
    input: {
        width: 200,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        color:'black'
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
        color:'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
});