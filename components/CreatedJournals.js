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
