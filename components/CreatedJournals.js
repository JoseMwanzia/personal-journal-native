import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import {  Text, View, ActivityIndicator, StyleSheet, Pressable, Modal, ScrollView } from "react-native"; // Import Text from react-native
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useNavigation } from "@react-navigation/native";

export default function CreatedJournals({ userData, newEntry }) {
    const navigation = useNavigation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleLongPress = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        async function fetchUserJournals() {
            const id = userData.id

            try {
                const response = await fetch(`http://192.168.100.166:3000/journal/${parseInt(id)}`)
                const result = await response.json()

                if (result) {
                    setLoading(false);
                    setData(result)
                }

            } catch (error) {
                console.error(error);
            }
        }
        fetchUserJournals()
    }, [userData])

    useEffect(() => {
        if (newEntry) {
            setData(prevData => [newEntry, ...prevData])
        }
    }, [newEntry])

    async function handleDeleteEntry(journalId) {
        const id = userData.id
        try {
            const response = await fetch(`http://192.168.100.166:3000/delete/${parseInt(id)}/${parseInt(journalId)}`, {
                method: "DELETE"
            })
            const result = await response.json()

            if (result.success) {
                setData((prevData) => prevData.filter(entry => entry.id !== journalId));
                console.log(result.success);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }
    // console.log(data.map((entry) => entry.id));

    const entry = data.map((entry) => (

        <View key={entry.id}>

            <ListItem
                Component={Pressable}
                containerStyle={{ marginBottom: 5, width: 350, height: 150 }}
                disabledStyle={{ opacity: 0.5 }}
                onLongPress={() => handleLongPress(entry)}
                onPress={() => navigation.navigate('Update', {
                    entryId: entry.id,
                    initialTitle: entry.title,
                    initialContent: entry.content,
                    initialCategory: entry.category

                })} // Fixed onPress event handler
                pad={20}
                key={entry.id}

            >


                <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Item Details</Text>
                            <Text style={styles.modalContent}>{entry.title}</Text>
                            <Pressable
                                style={styles.closeButton}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>




                <Pressable>
                    <FontAwesome name="edit" size={24} color="black" />
                </Pressable>

                <ListItem.Content>
                    <Text style={{color: 'gray'}}>Created {formatDistanceToNow(entry.created_at, { addSuffix: true })}</Text>
                    <Text style={{color: 'gray'}}>Updated {formatDistanceToNow(entry.updated_at, { addSuffix: true })}</Text>
                    <ListItem.Title>
                        <Text>{entry.category}</Text> {/* Wrapped text in Text component */}
                    </ListItem.Title>
                    <View style={styles.separator} />
                    <ListItem.Title>
                        <Text>{entry.title}</Text> {/* Wrapped text in Text component */}
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        <Text>{entry.content}</Text> {/* Wrapped text in Text component */}
                    </ListItem.Subtitle>
                </ListItem.Content>

                <Pressable onPress={() => handleDeleteEntry(entry.id)}>
                    <FontAwesome6 name="delete-left" size={24} color="black" />
                </Pressable>

            </ListItem>
        </View >


    ))

    return (
        <>
            {entry}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
    },
    separator: {
        height: 1,
        width: '80%',
        backgroundColor: 'grey',
        marginVertical: 10,
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      item: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        width: '80%', // Adjust the width as needed
        maxWidth: 400, // Optional: set a maximum width
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 20,
        marginBottom: 10,
      },
      modalContent: {
        fontSize: 16,
        marginBottom: 20,
      },
    closeButton: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 10,
      },
      closeButtonText: {
        color: 'white',
        fontSize: 16,
      },
});