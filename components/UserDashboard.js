import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import CreatedJournals from "./CreatedJournals";

const UserDashboard = ({ route }) => {
    const userData = route.params?.userData;

    const [data, setData] = useState({
        title: "",
        content: "",
        category: "",
    });

    const categories = [
        { label: "Personal", value: "personal" },
        { label: "Travel", value: "travel" },
        { label: "Work", value: "work" },
        { label: "Miscellaneous", value: "miscellaneous" },
    ];

    const handleInputChange = (value, name) => {
        setData({ ...data, [name]: value });
    };

    async function handleSubmit() {
        const id = userData.map((user) => user.id);

        try {
            const response = await fetch(
                `http://192.168.100.166:3000/journal/${parseInt(id)}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            setData({ title: "", content: "", category: "" }); // when successfull reset state
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    const user = userData.map((user) => (
        <ScrollView key={user.id} contentContainerStyle={styles.container}>
            <View style={styles}>
                <Text style={styles.text}> Hi, {user.name}!</Text>
            </View>
            <View style={styles.textAreaContainer}>
                <TextInput
                    style={styles.titleText}
                    placeholder="Title for your entry!"
                    placeholderTextColor="grey"
                    value={data.title}
                    onChangeText={(text) => handleInputChange(text, "title")}
                    multiline={true}
                />
            </View>
            <View style={styles.textAreaContainer}>
                <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Put your thought here!"
                    placeholderTextColor="grey"
                    value={data.content}
                    onChangeText={(text) => handleInputChange(text, "content")}
                    multiline={true}

                />
            </View>

            <View style={styles.container2}>

                    <RNPickerSelect

                        onValueChange={(text) => handleInputChange(text, "category")}
                        items={categories}
                        // value={data.category !== null ? data.category : ""}
                        placeholder={{ label: "Select a category", value: "", color: 'red' }}
                        fixAndroidTouchableBug={true}
                    />


                <Pressable onPress={handleSubmit} style={styles.button2}>
                    <Text style={styles.buttonText2} >Create</Text>
                </Pressable>
            </View>

            <View>
                <CreatedJournals userData={userData} />
            </View>

        </ScrollView>
    ));

    return (
    <>
    {user}
    </>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
    },
    button: {
        backgroundColor: "red",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textAreaContainer: {
        margin: 8,
    },
    textArea: {
        height: 150,
        width: 350,
        justifyContent: "flex-start",


        borderColor: '#000', // Border color
        borderWidth: 1, // Border width
        borderRadius: 5, // Optional: Border radius for rounded corners
        paddingLeft: 10, // Optional: Padding inside the input
        paddingTop: 5, // Optional: Padding inside the input

    },
    titleText: {
        height: 30,
        width: 350,
        justifyContent: "flex-start",

        borderColor: '#000', // Border color
        borderWidth: 1, // Border width
        borderRadius: 5, // Optional: Border radius for rounded corners
        paddingLeft: 10, // Optional: Padding inside the input
        paddingTop: 5, // Optional: Padding inside the input
    },
    button: {
        backgroundColor: "red",
        height: 25,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: '100px',
        margin: '10px'
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },

    container2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button2: {
        backgroundColor: '#007bff',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        margin: 4,
    },
    buttonText2: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserDashboard;
