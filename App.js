import { StatusBar } from 'expo-status-bar';
import { StyleSheet, LogBox } from 'react-native';
import LoginForm from './components/LoginForm';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDashboard from './components/UserDashboard';
import Logout from './components/Logout';
import Register from './components/Register';
import UpdateJournal from './components/UpdateJournal';


// Used LogBox to suppress unwanted warnings and handle errors gracefully 

// Ignore specific warnings
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all warnings
LogBox.ignoreAllLogs();

const globalErrorHandler = (error, isFatal) => {
  if (isFatal) {
    console.error('Fatal error:', error);
  } else {
    console.error('Non-fatal error:', error);
  }
};

ErrorUtils.setGlobalHandler(globalErrorHandler);
// END OF LogBox to suppress unwanted warnings and handle errors gracefully 


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log(data, 'at app.js');
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getData();
  }, [isLoggedIn]);




  const StackNav = () => {
    const navigation = useNavigation();
    const Stack = createNativeStackNavigator();

    return (
      <Stack.Navigator
        screenOptions={{
          statusBarColor: '#0163d2',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#0163d2',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}>

        <Stack.Screen
          name="userDashboard"
          component={UserDashboard}
          options={{headerShown: false, title: ''}}
        />

        <Stack.Screen
          name="Update"
          component={UpdateJournal}
          options={{ headerShown: true, title: 'Update Journal' }}
        />

        <Stack.Screen
          name="Logout"
          component={Logout}
        />

        <Stack.Screen
          name="LoginUser"
          component={LoginNav}
        />

      </Stack.Navigator>
    );
  };
  
  function DrawerNav() {
    const Drawer = createNativeStackNavigator();

    return (
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
      >
        <Drawer.Screen name="dashboard" component={StackNav} options={{ headerShown: false }} />
      </Drawer.Navigator>
    );
  }

  const LoginNav = () => {
    const Stack = createNativeStackNavigator();

    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={DrawerNav} />
      </Stack.Navigator>
    );
  };


  return (
    <NavigationContainer>

      {isLoggedIn ? <DrawerNav /> : <LoginNav />}

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
