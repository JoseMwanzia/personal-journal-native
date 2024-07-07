import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import Logout from './Logout';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




const Stack = createNativeStackNavigator();

const UserDashboard = ({ route }) => {
    const userData = route.params?.userData

    console.log(userData.map(user => user));

    const user = userData.map(user => 
         (
            <ScrollView key={user.id} contentContainerStyle={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.text}> Welcome {user.name} to your dashboard!</Text>
                </View>
                <View  style={styles.container}>
                    <Logout/>
                </View>
            </ScrollView>
        )

    )
    return (
        <>
            {user}

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20
    },
    button: {
        backgroundColor: "red",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
});

export default UserDashboard;
