import React,{
    useEffect,
    useState
} from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    Dimensions,
} from 'react-native';
  
function RemainderScreen() {

    return (
      <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <View
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        </View>
        <View
        style={{
          flex:5,
          position:"relative",
          width:450,
          height:450,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
            <Text>
                Remainder Screen
            </Text>
        </View>
      </SafeAreaView>
    );
}
  
export default RemainderScreen;  