import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { TouchableHighlight, Text, View, ActivityIndicator, StyleSheet, Pressable } from "react-native"; // Import Text from react-native
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default ({ userData }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUserJournals() {
            const id = userData.map((user) => user.id);

            try {
                const response = await fetch(`http://192.168.100.166:3000/journal/${parseInt(id)}`)
                const result = await response.json()

                if (result) {
                    setLoading(false)
                    setData(result)
                }

            } catch (error) {
                console.error(error);
            }
        }
        fetchUserJournals()
    }, [])

    // console.log(data.map((entry) => entry.id));

    const entry = data.map((entry) => (
        <ListItem
            Component={TouchableHighlight}
            containerStyle={{ marginBottom: 10, width: 350, height: 150 }}
            disabledStyle={{ opacity: 0.5 }}
            onLongPress={() => console.log("onLongPress()")}
            onPress={() => console.log("onPress()")} // Fixed onPress event handler
            pad={20}
            key={entry.id}

        >
            <Pressable>
                <FontAwesome name="edit" size={24} color="black" />
            </Pressable>

            <ListItem.Content>
                <ListItem.Title>
                    {entry.category} {/* Text component directly inside ListItem.Title */}
                </ListItem.Title>
                <View style={styles.separator} />
                <ListItem.Title>
                    {entry.title} {/* Text component directly inside ListItem.Title */}
                </ListItem.Title>
                <ListItem.Subtitle>
                    {entry.content} {/* Text component directly inside ListItem.Subtitle */}
                </ListItem.Subtitle>
            </ListItem.Content>

            <Pressable onPress={() => handleDeleteEntry(entry.id)}>``
                <FontAwesome6 name="delete-left" size={24} color="black" />
            </Pressable>

        </ListItem>
    ))

    return (
        <>
            {entry}
        </>
    );
};
