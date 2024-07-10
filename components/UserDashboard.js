import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import SelectDropdown from 'react-native-select-dropdown'
import CreatedJournals from "./CreatedJournals";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "./Header";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserDashboard = ({ }) => {
    // const userData = route.params?.userData;
    const [userData, setUserData] = useState([]);
    const [newEntry, setNewEntry] = useState();
    const [data, setData] = useState({
        title: "",
        content: "",
        category: "",
    });
    const [refreshing, setRefreshing] = useState(false);
    const [updatedName, setUpdatedName] = useState();

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, [])

    const categories = [
        { title: "Personal", icon: 'emoticon-happy-outline' },
        { title: "Travel", icon: 'emoticon-cool-outline' },
        { title: "Work", icon: 'emoticon-lol-outline' },
        { title: "Miscellaneous", icon: 'emoticon-wink-outline' },
    ];

    const handleInputChange = (value, name) => {
        setData({ ...data, [name]: value });
    };

    async function handleSubmit() {
        const id = userData.id

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

            const result = await response.json();

            if (result) {
                setNewEntry(result); // to render new entries when created
                setData({ title: "", content: "", category: "" }); // when successfull reset state
            } else {
                console.error('Error:', result);
            }

        } catch (error) {
            console.error(error);
        }
    }

    // update username on the dashboard everytime the username is updated
    useEffect(() => {
        setUserData((prevData) => {
            // console.log(prevData);
            return { ...prevData, name: updatedName };
        });
    }, [updatedName]);


    // Callback function to receive data from chnangeUsername child
    const handleUpdatedName = (newUserName) => {
        setUpdatedName(newUserName);
    };

    // get user data and update every 3 seconds
    useEffect(() => {
        const fetchData = async () => {
            try {

                const storedUserData = await AsyncStorage.getItem('token');
                const parsedId = JSON.parse(storedUserData).map((user) => user.id)

                const response = await fetch(`http://192.168.100.166:3000/user/${parseInt(parsedId)}`)
                const result = await response.json()

                if (response.ok) {
                    setUserData(result);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [setTimeout(() => { }, 3000)]);

    // optimistic render when ther is no data
    if (!userData) {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        )
    }


    return (
        <>
            <Header userData={userData} />
            <ScrollView key={userData.id} contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View key={userData.id} style={styles.container}>
                    <Text style={styles.text}> Hi, {userData.name}!</Text>
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

                    {/* <RNPickerSelect

                        onValueChange={(text) => handleInputChange(text, "category")}
                        items={categories}
                        // value={data.category !== null ? data.category : ""}
                        placeholder={{ label: "Select a category", value: "", color: 'red' }}
                        fixAndroidTouchableBug={true}
                    /> */}


                    <SelectDropdown
                        data={categories}

                        onSelect={(selectedItem, index) => {
                            // console.log(selectedItem, index);
                            handleInputChange(selectedItem.title, 'category')
                        }}

                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    {selectedItem && (
                                        <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.title) || 'Select a category'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}

                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />


                    <Pressable onPress={handleSubmit} style={styles.button2}>
                        <Text style={styles.buttonText2} >Create</Text>
                    </Pressable>
                </View>

                <CreatedJournals userData={userData} newEntry={newEntry} />
            </ScrollView >
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
    // });


    // const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});
export default UserDashboard;
