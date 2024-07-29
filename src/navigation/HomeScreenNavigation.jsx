import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import AddWaterScreen from '../screens/AddWaterScreen';
import CalenderScreen from '../screens/CalenderScreen';
import SettingScreen from '../screens/SettingScreen';
import RemainderScreen from '../screens/RemainderScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function HomeScreenNavigation() {

  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
  }, []);

  /* if (initialRouteName === null) {
    // You can return a loading screen or null until initialRouteName is set
    return null;
  } */

  return (
    <SafeAreaView
    style={{
      flex: 1,
    }}
    >
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName={"HomeScreen"}
      >
        <Stack.Screen
        name="HomeScreen"
        component={HomeScreen} />
        <Stack.Screen
        name="AddWaterScreen"
        component={AddWaterScreen} />
        <Stack.Screen
        name="CalenderScreen"
        component={CalenderScreen}
        options={{
          animation: 'slide_from_left',        
        }}
        />
        <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          animation: 'slide_from_right',
        }}
        />
        <Stack.Screen
        name="RemainderScreen"
        component={RemainderScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
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
