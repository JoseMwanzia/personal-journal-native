import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserDashboard from './UserDashboard';
import Header from './Header';

const HeaderAndUser = () => {


    return (
        <View style={styles.container}>
            <Header/>
            <UserDashboard/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    vertical: {
        marginTop: 400
    },
});

export default HeaderAndUser;
