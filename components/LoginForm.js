import React, { useState, useEffect } from 'react'
import { Alert, Image, Pressable, StyleSheet, Switch, Text, TextInput, View, Linking, ScrollView } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require("../assets/Insighter.png")


export default function LoginForm({ navigation }) {
    const [click, setClick] = useState(false);
    const [data, setData] = useState({
        email: '', password: ''
    });

    const handleInputChange = (value, field) => {
        setData(prevState => ({ ...prevState, [field]: value }));
        };

    async function handleSubmit() {
        const response = await fetch('http://192.168.100.166:3000/login', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        setResponseData(result)

        if (response.ok) {
            AsyncStorage.setItem('token', JSON.stringify(result))

            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true))
            navigation.navigate('userDashboard')
        }
    }

    async function getData() {
        const data = await AsyncStorage.getItem('isLoggedIn')
        console.log(data, 'at App.js');
    }

    useEffect(() => {
        getData();
        console.log("Hii");
    }, [])

    return (
        <>
            <ScrollView keyboardShouldPersistTaps={'always'} contentContainerStyle={styles.container}>

                <Image source={logo} style={styles.image} resizeMode='contain' />
                <Text style={styles.title}>Login</Text>
                <View style={styles.inputView}>
                    <TextInput style={styles.input} placeholder='EMAIL' value={data.email} onChangeText={(text) => handleInputChange(text, 'email')} autoCorrect={false}
                        autoCapitalize='none' />
                    <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={data.password} onChangeText={(text) => handleInputChange(text, 'password')} autoCorrect={false}
                        autoCapitalize='none' />
                </View>
                <View style={styles.rememberView}>
                    <View style={styles.switch}>
                        <Switch value={click} onValueChange={setClick} trackColor={{ true: "green", false: "gray" }} />
                        <Text style={styles.rememberText}>Remember Me</Text>
                    </View>
                    <View>
                        <Pressable onPress={() => Alert.alert("Forget Password!")}>
                            <Text style={styles.forgetText}>Forgot Password?</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </Pressable>
                    <Text style={styles.optionsText}>FOLLOW US ON</Text>
                </View>
                {/* <Image source={linkedin} style={styles.icons} /> */}

                <View style={styles.mediaIcons}>
                    <Pressable onPress={() => { Linking.openURL('https://www.instagram.com/shamiri_institute/'); }}>
                        <FontAwesome6 name="instagram" size={40} color="black" />
                    </Pressable>
                    <Pressable onPress={() => { Linking.openURL('https://www.twitter.com/shamiriteam'); }}>
                        <FontAwesome6 name="x-twitter" size={40} color="black" />
                    </Pressable>
                    <Pressable onPress={() => { Linking.openURL('https://www.linkedin.com/company/shamiri-institute/') }}>
                        <FontAwesome6 name="linkedin" size={40} color="black" />
                    </Pressable>
                    <Pressable onPress={() => { Linking.openURL('https://www.youtube.com/@shamiriinstitute'); }}>
                        <FontAwesome6 name="youtube" size={40} color="black" />
                    </Pressable>
                </View>

                <Text style={styles.footerText}>Don't Have Account?<Pressable onPress={() => navigation.navigate('register')}><Text style={styles.signup} >  Sign Up</Text></Pressable></Text>


            </ScrollView>
        </>
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
        color: "red",
        fontSize: 13
    }
})