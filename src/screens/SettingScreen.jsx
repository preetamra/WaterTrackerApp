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
  
function SettingScreen(props) {

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
                Setting Screen
            </Text>
            <Button
            title='Remainder'
            onPress={() => {
                props.navigation.navigate('RemainderScreen');
            }}
            ></Button>
            <Button
            title='Recommendation'
            onPress={() => {
                props.navigation.navigate('Recommend');                
            }}
            ></Button>
        </View>
      </SafeAreaView>
    );
}
  
export default SettingScreen;
  