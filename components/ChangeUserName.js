import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import { Input } from 'react-native-elements';

export default function ChangeUserName({ navigation, userData, setVisible }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isUsernameAccordionOpen, setIsUsernameAccordionOpen] = useState(false);

    //   console.log(userData.map((user) => user.id))
    const handleChangeUsername = async () => {
        const id = userData.map((user) => user.id)
        try {
            const response = await fetch(`http://192.168.100.166:3000/profile/${parseInt(id)}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                setVisible(false)
                Alert.alert("Success changing username!") || alert("Success changing username!")
            }

            const result = await response.json()

            if (!result.ok) {
                setError(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
            <View style={styles.container}>
                <Button
                    title="Change username"
                    onPress={() => setIsUsernameAccordionOpen(!isUsernameAccordionOpen)}
                />

                {isUsernameAccordionOpen && (
                    <View style={styles.accordion}>
                        <Input
                            placeholder="Enter new username"
                            value={name}
                            onChangeText={setName}
                            // containerStyle={{ marginBottom: 10 }}
                        />
                        <Button title="Submit" onPress={handleChangeUsername} />
                        
                        {error && <Text style={{color: 'red'}}>{error}</Text>}
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
});
