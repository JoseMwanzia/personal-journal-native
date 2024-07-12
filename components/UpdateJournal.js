import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Text, View, TextInput, StyleSheet, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function UpdateJournal({ route }) {
    const navigation = useNavigation()
    const { entryId, initialTitle, initialContent, initialCategory, onUpdate } = route.params;

    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [category, setCategory] = useState(initialCategory);


    //update request
    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('userToken');

        try {
            const response = await fetch(`http://192.168.100.166:3000/journal/${entryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, category }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Journal entry updated successfully.');
                onUpdate(true) // send a boolean back to parent(CreatedJournnals)
                navigation.goBack(); // Go back to the previous screen
            } else {
                Alert.alert('Error', 'Failed to update journal entry.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while updating the journal entry.');
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Content</Text>
            <TextInput
                style={styles.inputContent}
                value={content}
                onChangeText={setContent}
                multiline
            />
            <Text style={styles.label}>Category</Text>
            <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
            />
            <Pressable style={styles.submitButton} onPress={handleUpdate}>
                <Text style={styles.submitText}>Update</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    inputContent: {
        height: 120,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#0675bd', // Button background color
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 32, // Horizontal padding
        borderRadius: 8, // Rounded corners
        alignItems: 'center', // Center text
        alignSelf: 'center',
        justifyContent: 'center', // Center text
        marginVertical: 10, // Vertical margin for spacing
        width: 130
    },
    submitText: {
        color: '#FFFFFF', // Text color
        fontSize: 16, // Font size
        fontWeight: 'bold', // Font weight
    },
});

export default UpdateJournal