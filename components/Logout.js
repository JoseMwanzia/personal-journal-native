import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'

export default function Logout({ setVisible }) {
    const navigation = useNavigation()


    async function handelLogout() {
        AsyncStorage.setItem('isLoggedIn', '')
        AsyncStorage.setItem('token', '')
        setVisible(false)
        try {
            const response = await fetch('http://192.168.100.166:3000/logout', {
                method: "DELETE",
                headers: { Authorization: `Bearer: ${await AsyncStorage.getItem('userToken')}` }
            })
            const result = await response.json();

            if (response.ok) {
                await AsyncStorage.removeItem('isLoggedIn')
                await AsyncStorage.removeItem('data')
                await AsyncStorage.removeItem('userToken')
                navigation.navigate('LoginUser')
                console.log(result);
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }

    }

    return (
        <Pressable style={styles.button} onPress={handelLogout}>
            <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    },
    image: {
        height: 180,
        width: 200
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "black"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 7
    },
    rememberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 8
    },
    switch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"

    },
    rememberText: {
        fontSize: 13
    },
    forgetText: {
        fontSize: 11,
        color: "red"
    },
    button: {
        backgroundColor: "red",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: 110
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    icons: {
        width: 40,
        height: 40,
    },
    footerText: {
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: "red",
        fontSize: 15
    }
})