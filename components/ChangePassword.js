import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, Platform, Pressable } from 'react-native';
import { Input } from 'react-native-elements';

export default function ChangePassword({ navigation, userId, setVisible }) {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '', newPassword: ''
    });
    const [error, setError] = useState('');
    const [isPasswordAccordionOpen, setIsPasswordAccordionOpen] = useState(false);


    const handleInputChange = (value, field) => {
        setPasswordData(prevState => ({ ...prevState, [field]: value }));
    };

    const handleChangePassword = async () => {


        try {
            const response = await fetch(`http://192.168.100.166:3000/password/${parseInt(userId)}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData),
            });

            if (response.ok) {
                setVisible(false)

                if (Platform.OS === 'web') {
                    alert("Success changing password!")
                } else if (Platform.OS === 'ios' || 'android') {
                    Alert.alert("Success changing password!")
                }

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

            <Pressable style={styles.passwordButton} onPress={() => setIsPasswordAccordionOpen(!isPasswordAccordionOpen)}>
                <Text style={styles.usernameText}>Change Password</Text>
            </Pressable>

            {isPasswordAccordionOpen && (
                <View style={styles.accordion}>
                    <Input
                        placeholder="Enter old Password"
                        secureTextEntry
                        value={passwordData.oldPassword}
                        onChangeText={(text) => handleInputChange(text, 'oldPassword')}
                        containerStyle={{ marginBottom: 10 }}
                    />
                    <Input
                        placeholder="Enter new Password"
                        secureTextEntry
                        value={passwordData.newPassword}
                        onChangeText={(text) => handleInputChange(text, 'newPassword')}
                        containerStyle={{ marginBottom: 10 }}
                    />
                    {error && <Text style={{ color: 'red' }}>{error}</Text>}

                    <Pressable style={styles.submitButton} onPress={handleChangePassword}>
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
    passwordButton: {
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
        width: 130,
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
