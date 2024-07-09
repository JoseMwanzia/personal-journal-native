import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, Text } from 'react-native';
import { Input } from 'react-native-elements';

export default function ChangePassword({ navigation, userData, setVisible }) {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '', newPassword: ''
    });
    const [error, setError] = useState('');
    const [isPasswordAccordionOpen, setIsPasswordAccordionOpen] = useState(false);

    //   console.log(userData.map((user) => user.id))

    const handleInputChange = (value, field) => {
        setPasswordData(prevState => ({ ...prevState, [field]: value }));
    };

    const handleChangePassword = async () => {

        const id = userData.map((user) => user.id)

        try {
            const response = await fetch(`http://192.168.100.166:3000/password/${parseInt(id)}`, {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData),
            });

            if (response.ok) {
                setVisible(false)
                Alert.alert("Success changing password!") || alert("Success changing password!")
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
                title="Change Password"
                onPress={() => setIsPasswordAccordionOpen(!isPasswordAccordionOpen)}
            />

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
                    {error && <Text style={{color: 'red'}}>{error}</Text>}
                    <Button title="Submit" onPress={handleChangePassword} />
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
