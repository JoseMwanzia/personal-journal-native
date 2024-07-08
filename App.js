import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm'; // Ensure this path is correct
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDashboard from './components/UserDashboard';
import Logout from './components/Logout';
import Register from './components/Register';
import Header from './components/Header';
import ChangeUserName from './components/ChangeUserName';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const Stack = createNativeStackNavigator();
const Drawer = createNativeStackNavigator();



export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Example: Fetch user data from AsyncStorage or an API
    const fetchData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('token');

        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    // console.log(data, 'at app.jsx');
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getData();
  }, [isLoggedIn]);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
