import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginForm from './components/LoginForm'; 
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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



  function Root() {
    return (
      <Drawer.Navigator>
        <Stack.Screen name="login" component={LoginForm} initialParams={{ userData: userData }}/>
        <Stack.Screen name="register" component={Register} />
      </Drawer.Navigator>
    );
  }



  return (
    <NavigationContainer>
      <SafeAreaProvider>

        {isLoggedIn ? (
          <>
            <Header userData={userData} />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="userDashboard" component={UserDashboard} initialParams={{ userData: userData }} />
              <Stack.Screen name="logout" component={Logout} />

            </Stack.Navigator>
          </>
        ) : (
          <>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>

              <Stack.Screen name="root" component={Root} />
            </Stack.Navigator>
          </>
        )}
      </SafeAreaProvider>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
});
