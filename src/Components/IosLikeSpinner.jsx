import { index } from 'd3';
import React from 'react';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
import { TimerPicker, TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

function IosLikeSpinner(props) {

    return (
       <View
       style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <TimerPickerModal
            visible={true}
            onConfirm={(pickedDuration) => {
                /* setAlarmString(formatTime(pickedDuration));
                setShowPicker(false); */
                console.log(pickedDuration);
            }}
            modalTitle="Set Alarm"
            onCancel={() => {}}
            closeOnOverlayPress
            use12HourPicker
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            styles={{
                theme: "light",
            }}
        />
        {/* <TimerPicker
            padWithNItems={2}
            hourLabel=":"
            minuteLabel=":"
            secondLabel=""
            LinearGradient={LinearGradient}
            Haptics={Haptics}
            styles={{
                theme: "dark",
                backgroundColor: "#202020",
                pickerItem: {
                    fontSize: 34,
                },
                pickerLabel: {
                    fontSize: 32,
                    marginTop: 0,
                },
                pickerContainer: {
                    marginRight: 6,
                },
                pickerItemContainer: {
                    width: 100
                },
                pickerLabelContainer: {
                    right: -20,
                    top: 0,
                    bottom: 6,
                    width: 40,
                    alignItems: "center",
                },
            }}
        /> */}
       </View>
    );
}
  
export default IosLikeSpinner;  