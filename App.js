import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Provider } from 'react-redux';
import { Asset } from 'expo-asset';

import Recommend from './src/screens/Recommend';
import HomeScreen from './src/screens/HomeScreen';
import HomeScreenNavigation from './src/navigation/HomeScreenNavigation';
import store from './src/store/store';

const Stack = createNativeStackNavigator();

const initialExecute = false;

const loadDatabase = async () => {
  const dbName = 'mySQLiteDB.db';
  const dbAsset = require('./assets/mySQLiteDB.db');
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFIlePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFIlePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite', {
      intermediates: true
    });
    await FileSystem.downloadAsync(dbUri, dbFIlePath);
  }
}

export default function App() {
  const [dbLoaded,setDbLoaded] = useState(false);

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

  useEffect(() => {
    loadDatabase().then(() => {
      setDbLoaded(true);
    }).catch((error) => {
      console.error(error);
    });
  },[])

  if (!dbLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (initialRouteName === null) {
    // You can return a loading screen or null until initialRouteName is set
    return null;
  }

  return (
    <Provider
    store={store}
    >
    <NavigationContainer>
      <React.Suspense>
      <SQLiteProvider
        useSuspense
        databaseName='mySQLiteDB.db'
      >
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={initialRouteName}
      >
        <Stack.Screen name="Recommend" component={Recommend} />
        <Stack.Screen name="HomeScreen" component={HomeScreenNavigation} />
      </Stack.Navigator>
    </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
    </Provider>
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
