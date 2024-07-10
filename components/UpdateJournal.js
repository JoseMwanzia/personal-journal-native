import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Text, View, TextInput, StyleSheet, Button, Alert, Pressable } from 'react-native'

function UpdateJournal({ route }) {
    const navigation = useNavigation()
    const { entryId, initialTitle, initialContent, initialCategory } = route.params;

    console.log(entryId);
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [category, setCategory] = useState(initialCategory);


    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://192.168.100.166:3000/journal/${entryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, category }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Journal entry updated successfully.');
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
                style={styles.input}
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
            <Pressable onPress={handleUpdate}>
                <Text>Update</Text>
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
});

export default UpdateJournal