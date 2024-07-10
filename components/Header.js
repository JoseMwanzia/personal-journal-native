import React, { useState } from 'react';
import { Header, Icon, Button, Overlay, Avatar } from 'react-native-elements';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logout from './Logout';
import ChangeUserName from './ChangeUserName';
import ChangePassword from './ChangePassword';


const App = ({ userId, onHandleUpdatedName }) => {
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (
        <View>
            <Header
                backgroundColor="black"
                backgroundImageStyle={{}}
                barStyle="light-content"
                centerComponent={{
                    text: "SHAMIRI",
                    style: { color: "#fff" }
                }}
                centerContainerStyle={{}}
                containerStyle={{ width: 'auto' }}
                leftComponent={
                    <Icon
                        name="menu"
                        color="#fff"
                        onPress={toggleOverlay}
                    />
                }
                leftContainerStyle={{}}
                placement="center"
                rightContainerStyle={{}}
                statusBarProps={{}}
            />
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={styles.overlay}
            >
                <View style={styles.menu}>
                    <Avatar
                        size={'large'}
                        source={{
                            uri:
                                '../assets/avatar.png'
                        }}
                    />
                    <ChangeUserName userId={userId} setVisible={setVisible} onHandleUpdatedName={onHandleUpdatedName} />
                    <ChangePassword userId={userId} setVisible={setVisible}/>
                    <View style={styles.separator} />
                    <Logout setVisible={setVisible}/>
                </View>
            </Overlay>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '75%',
        padding: 0,
        backgroundColor: 'white',
        elevation: 5,
    },
    menu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        width: '80%',
        backgroundColor: 'grey',
        marginVertical: 10,
    },
});

export default App;
