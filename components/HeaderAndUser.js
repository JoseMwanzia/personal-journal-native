import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import UserDashboard from './UserDashboard';
import Header from './Header';

const HeaderAndUser = ({ route }) => {
    const userData = route.params?.userData;

    if (!userData) {
        return (
            <View style={styles.vertical}>
                <ActivityIndicator size="large" color="red" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Header userData={userData} />
            <UserDashboard userData={userData} />
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
