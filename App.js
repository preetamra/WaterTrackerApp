import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

import Recommend from './src/screens/Recommend';
import HomeScreen from './src/screens/HomeScreen';

import HomeScreenNavigation from './src/navigation/HomeScreenNavigation';

const Stack = createNativeStackNavigator();

const initialExecute = false;

export default function App() {

  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('setUpComplete');
        if (value !== null) {
           //Data exists
           setInitialRouteName('HomeScreen');
        }else{
          //Data does not exist
          setInitialRouteName('Recommend');
        }
      } catch (e) {
        // error reading value
        console.error(e);
      }
    };

    getData();
  }, []);

  if (initialRouteName === null) {
    // You can return a loading screen or null until initialRouteName is set
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={initialRouteName}
      >
        <Stack.Screen name="Recommend" component={Recommend} />
        <Stack.Screen name="HomeScreen" component={HomeScreenNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
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
