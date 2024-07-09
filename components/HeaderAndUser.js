import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserDashboard from './UserDashboard';

const HeaderAndUser = () => {


    return (
        <View style={styles.container}>

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
