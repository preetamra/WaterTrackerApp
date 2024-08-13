import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';

import HomeScreen from '../screens/HomeScreen';
import AddWaterScreen from '../screens/AddWaterScreen';
import CalenderScreen from '../screens/CalenderScreen';
import SettingScreen from '../screens/SettingScreen';
import RemainderScreen from '../screens/RemainderScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Test from '../screens/TestAnimation';
import AddCustomDrinkScreen from '../screens/AddCustomDrinkScreen';
import EditDrinkList from '../screens/EditDrinkList';
import WidgetScreen from '../screens/WidgetsScreen';

const Stack = createNativeStackNavigator();

export default function HomeScreenNavigation() {

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
        <Stack.Screen
        name='CustomDrinkScreen'
        component={AddCustomDrinkScreen}
        />
        <Stack.Screen
        name='EditCustomDrinkListScreen'
        component={EditDrinkList}
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
