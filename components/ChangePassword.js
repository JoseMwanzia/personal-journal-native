import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { Input } from 'react-native-elements';

export default function ChangePassword({ navigation, userData }) {
    const [passwordData, setPasswordData] = useState({
        oldPassword: '', newPassword: ''
    });
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
                        value={passwordData.oldPassword}
                        onChangeText={(text) => handleInputChange(text, 'oldPassword')}
                        containerStyle={{ marginBottom: 10 }}
                    />
                    <Input
                        placeholder="Enter new Password"
                        value={passwordData.newPassword}
                        onChangeText={(text) => handleInputChange(text, 'newPassword')}
                        containerStyle={{ marginBottom: 10 }}
                    />
                    <Button title="Submit" onPress={handleChangePassword} />
                </View>
            )}
        </View>
    );
