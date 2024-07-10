import React, { useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View, Linking, TouchableOpacity } from 'react-native'
const logo = require("../assets/shamirilogo.png")


export default function Register({ navigation }) {
    const [error, setError] = useState()
    const [data, setData] = useState({
       name:'', email: '', password: ''
    });

    const handleInputChange = (value, name) => {
        setData({ ...data, [name]: value });
    };

    async function handleSubmit() {
        const response = await fetch('http://192.168.100.166:3000/register', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();


        if (result.ok) {
            navigation.navigate('Login');
            Alert.alert('You have successfully signed up!')
        } else {
            setError(result.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Image source={logo} style={styles.image} resizeMode='contain' />
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder='YOUR NAME' value={data.name} onChangeText={(text) => handleInputChange(text, 'name')} autoCorrect={false}
                    autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='EMAIL' value={data.email} onChangeText={(text) => handleInputChange(text, 'email')} autoCorrect={false}
                    autoCapitalize='none' />
                <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={data.password} onChangeText={(text) => handleInputChange(text, 'password')} autoCorrect={false}
                    autoCapitalize='none' />
            </View>

            <View style={styles.buttonView}>
                    {error && <Text style={{color: 'red', padding: 5}}>{error}</Text>}
                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            </View>

            <Text style={styles.footerText}>Already have an account?<TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.signup} >  login</Text></TouchableOpacity></Text>


        </SafeAreaView>
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
        backgroundColor: "#0675bd",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
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
        color: "indigo",
        fontSize: 15
    }
})