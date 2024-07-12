import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { Text, View, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from "@react-navigation/native";
import JournalModals from './JournalModals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreatedJournals({ userData, newEntry }) {
    const navigation = useNavigation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

    const handlePress = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem({});
    };

    // get the all users' journals and update after certain time
    useEffect(() => {
        async function fetchUserJournals() {
            const userId = userData.id
            const token = await AsyncStorage.getItem('userToken'); //get token 
            try {
                const response = await fetch(`http://192.168.100.166:3000/journal/${parseInt(userId)}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                })
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
    }, [setTimeout(() => { }, 2000)])

    // prepend a new created journal entry on the DOM
    useEffect(() => {
        if (newEntry) {
            setData(prevData => [newEntry, ...prevData])
        }
    }, [newEntry])

    // delete journals from DB and the DOM
    async function handleDeleteEntry(journalId) {
        const id = userData.id
        try {
            const response = await fetch(`http://192.168.100.166:3000/delete/${parseInt(id)}/${parseInt(journalId)}`, {
                method: "DELETE"
            })
            const result = await response.json()

            if (result.success) {
                setData((prevData) => prevData.filter(entry => entry.id !== journalId));
            }
        } catch (error) {
            console.error(error);
        }
    }

    // optimistic render when ther is no data
    if (loading) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    }

    // iterate journals from DB
    const entry = data.map((entry) => {
        return (
            <View key={entry.id}>
                <ListItem
                    Component={Pressable}
                    containerStyle={{ marginBottom: 5, width: 350, height: 200, overflow: "hidden"  }}
                    disabledStyle={{ opacity: 0.5 }}
                    onPress={() => handlePress(entry)}
                    onLongPress={() => {}} // Fixed onPress event handler
                    pad={20}
                    key={entry.id}
                    style={selectedItem ? { borderWidth: 1, borderColor: 'darkgrey' } : { borderWidth: 1, borderColor: 'blue' }}
                >
                    <JournalModals entry={entry} data={data} modalVisible={modalVisible} selectedItem={selectedItem} handleCloseModal={handleCloseModal} />

                    {/* send data to UpdateJournal.js comp on press */}
                    <Pressable onPress={() => navigation.navigate('Update', {
                        entryId: entry.id,
                        initialTitle: entry.title,
                        initialContent: entry.content,
                        initialCategory: entry.category

                    })}>
                        <FontAwesome name="edit" size={24} color="black" />
                    </Pressable>

                    <ListItem.Content>
                        <Text style={{ color: 'gray', fontSize: 12 }}>Created {formatDistanceToNow(entry.created_at, { addSuffix: true })}</Text>
                        <Text style={{ color: 'gray', fontSize: 12 }}>Updated {formatDistanceToNow(entry.updated_at, { addSuffix: true })}</Text>
                        <ListItem.Title>
                            <Text style={{ fontWeight: 'italicized', paddingBottom: 5, fontSize: 15, color: 'darkgray' }}>{`{${entry.category}}`}</Text> {/* Wrapped text in Text component */}
                        </ListItem.Title>
                        <View style={styles.separator} />
                        <ListItem.Title>
                            <Text style={{ fontWeight: "bold", paddingBottom: 10 }}>{entry.title}</Text> {/* Wrapped text in Text component */}
                        </ListItem.Title>
                        <ListItem.Subtitle style={{ paddingBottom: 10 }}>

                            <Text style={{ overflow: 'hidden', height: 40 }}>{entry.content.slice(0, 50) + "..."}</Text> {/* Wrapped text in Text component */}
                        </ListItem.Subtitle>
                        <Text style={{ color: 'grey', fontSize: 10 }}>Long Press to edit</Text>
                    </ListItem.Content>

                    <Pressable onPress={() => handleDeleteEntry(entry.id)}>
                        <FontAwesome6 name="delete-left" size={24} color="black" />
                    </Pressable>

                </ListItem>
            </View >


        )
    })

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

});