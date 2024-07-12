import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, Platform, Pressable } from 'react-native';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangeUserName({ userId, setVisible, onHandleUpdatedName }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const [isUsernameAccordionOpen, setIsUsernameAccordionOpen] = useState(false);

    const handleChangeUsername = async () => {

        const token = await AsyncStorage.getItem('userToken'); //get token 

        try {
            const response = await fetch(`http://192.168.100.166:3000/profile/${parseInt(userId)}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // send token to protect the route
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                setVisible(false)
                if (Platform.OS === 'web') {
                    alert("Success changing username!")
                } else if (Platform.OS === 'ios' || 'android') {
                    Alert.alert("Success changing username!") 
                }
            }

            const result = await response.json()
            if (result) {
                onHandleUpdatedName(result[0])
            }

            if (!result.ok) {
                setError(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.usernameButton} onPress={() => setIsUsernameAccordionOpen(!isUsernameAccordionOpen)}>
                <Text style={styles.usernameText}>Change Username</Text>
            </Pressable>

            {isUsernameAccordionOpen && (
                <View style={styles.accordion}>
                    <Input
                        placeholder="Enter new username"
                        value={name}
                        onChangeText={setName}
                    // containerStyle={{ marginBottom: 10 }}
                    />
                    {error && <Text style={{ color: 'red' }}>{error}</Text>}
                    <Pressable style={styles.submitButton} onPress={handleChangeUsername}>
                        <Text style={styles.submitText}>Submit</Text>
                    </Pressable>

                </View>
            )}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        width: '100%',
    },
    accordion: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        width: 250,
    },
    usernameButton: {
        backgroundColor: '#1E90FF', // Button background color
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 32, // Horizontal padding
        borderRadius: 8, // Rounded corners
        alignItems: 'center', // Center text
        justifyContent: 'center', // Center text
        marginVertical: 10, // Vertical margin for spacing
    },
    submitButton: {
        backgroundColor: '#1E90FF', // Button background color
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 32, // Horizontal padding
        borderRadius: 8, // Rounded corners
        alignItems: 'center', // Center text
        alignSelf: 'center',
        justifyContent: 'center', // Center text
        marginVertical: 10, // Vertical margin for spacing
        width: 130
    },
    usernameText: {
        color: '#FFFFFF', // Text color
        fontSize: 16, // Font size
        fontWeight: 'bold', // Font weight
    },
    submitText: {
        color: '#FFFFFF', // Text color
        fontSize: 16, // Font size
        fontWeight: 'bold', // Font weight
    },
});
