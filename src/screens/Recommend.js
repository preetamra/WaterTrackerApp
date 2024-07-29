import React,{
  useEffect,
  useState,
  useRef
} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Pressable
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { horizontalScale, verticalScale, moderateScale } from '../Utils/ResponsiveDesign';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function Recommend(props) {

  const [gender, setGender] = useState();
  const [weight, setWeight] = useState("0");
  const [activityLevel, setActivityLevel] = useState("2");
  const [weather, setWeather] = useState("2");

  const [recommededWaterIntake, setRecommededWaterIntake] = useState(0);

  const bottomSheetModalGenderRef = useRef(null);
  const bottomSheetModalWeightRef = useRef(null);
  const bottomSheetModalActivityRef = useRef(null);
  const bottomSheetModalWeatherRef = useRef(null);

  const snapPoints = React.useMemo(() => ['25%', '50%'], []);

  const storeData = async (key,value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
      console.error(e);
    }
  };

  useEffect(() => {
    let genderValue = isNaN(parseInt(gender)) ? 0 : parseInt(gender);
    let weightValue = isNaN(parseInt(weight)) ? 0 : parseInt(weight);
    let activityLevelValue = isNaN(parseInt(activityLevel)) ? 0 : parseInt(activityLevel);
    let weatherValue = isNaN(parseInt(weather)) ? 0 : parseInt(weather);

    let result = ( 62.38 * genderValue ) + (1.04 * weightValue) + (350.18 * activityLevelValue) + (128.74 * weatherValue + 1157.01);

    setRecommededWaterIntake(result);

    storeData('recommend',result.toString());

  }, [gender, weight, activityLevel, weather]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: verticalScale(200),
      paddingBottom: verticalScale(100),
      backgroundColor: '#02bfdb'
    }}>
      <View
      style={{
        flex:1,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: verticalScale(-160),
        flexDirection: 'row',
        width: "100%",
        backgroundColor: 'red',
        zIndex: 2,
      }}
      >
        <Button
        title='Go Back'
        onPress={() => {
          props.navigation.navigate('SettingScreen');
        }}
        ></Button>
        <Text>
        </Text>
      </View>
      <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: verticalScale(-20),
      }}
      >
      <Text
      style={{
        color: '#41EBF9',
        fontSize: moderateScale(15),
        fontWeight: 'bold',
        fontFamily: 'Inter',
        marginRight: horizontalScale(10),
      }}
      >
        Recommended goal
      </Text>
      <View>
        <Image
        source={
          require('../assets/RecommendedGoalIcon.png')
        }
        ></Image>
      </View>
      </View>

      <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
      <Text
      style={{
        fontSize: moderateScale(45),
        fontWeight: '700',
        color: '#E0FAFA',
      }}
      >
        {recommededWaterIntake.toFixed(2)}
      </Text>
      </View>
      <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
      <Text
      style={{
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#C7F9FA'
      }}
      >
        Your Daily Goal
      </Text>
      </View>
      <View
      style={{
        flex:6,
        marginTop: verticalScale(60),
      }}
      >
        <Pressable
        style={{
          width: horizontalScale(200),
          height: verticalScale(50),
          backgroundColor: '#01CBE4',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: moderateScale(10),
          marginBottom: verticalScale(20),
          flexDirection: 'row',
        }}
        onPress={() => {
          bottomSheetModalGenderRef.current.present();
        }}
        >
          <Text
          style={{
            color: '#A4F7FA',
            fontSize: moderateScale(15),
            fontWeight: 'bold',
          }}
          >
            Gender
          </Text>
          <Text>
          </Text>
          <Image
          source={
            require('../assets/Gender icon.png')
          }
          style={{
            width: horizontalScale(20),
            height: verticalScale(20),
            position: 'absolute',
            right: horizontalScale(10),
            top: verticalScale(15),
          }}
          ></Image>
        </Pressable>
        <Pressable
        style={{
          width: horizontalScale(200),
          height: verticalScale(50),
          backgroundColor: '#01CBE4',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: verticalScale(20),
          flexDirection: 'row',
        }}
        onPress={() => {
          bottomSheetModalWeightRef.current.present();
        }}
        >
          <Text
          style={{
            color: '#A4F7FA',
            fontSize: moderateScale(15),
          }}
          >
            Weight
          </Text>
          <Text>
          </Text>
          <Image
          source={
            require('../assets/Weight scale.png')
          }
          style={{
            width: horizontalScale(20),
            height: verticalScale(20),
            position: 'absolute',
            right: horizontalScale(10),
            top: verticalScale(15),
          }}
          ></Image>
        </Pressable>
        <Pressable
        style={{
          width: horizontalScale(200),
          height: verticalScale(50),
          backgroundColor: '#01CBE4',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: verticalScale(20),
          flexDirection: 'row',
        }}
        onPress={() => {
          bottomSheetModalActivityRef.current.present();
        }}
        >
          <Text
          style={{
            color: '#A4F7FA',
            fontSize: moderateScale(15),
          }}
          >
            Activity
          </Text>
          <Text>
          </Text>
          <Image
          source={
            require('../assets/Activity icon.png')
          }
          style={{
            width: horizontalScale(20),
            height: verticalScale(20),
            position: 'absolute',
            right: horizontalScale(10),
            top: verticalScale(15),
          }}
          ></Image>
        </Pressable>
        <Pressable
        style={{
          width: horizontalScale(200),
          height: verticalScale(50),
          backgroundColor: '#01CBE4',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: 10,
          marginBottom: verticalScale(20),
          flexDirection: 'row',
        }}
        onPress={() => {
          bottomSheetModalWeatherRef.current.present();
        }}
        >
          <Text
          style={{
            color: '#A4F7FA',
            fontSize: moderateScale(15),
          }}
          >
            Weather
          </Text>
          <Text>
          </Text>
          <Image
          source={
            require('../assets/Cloudy weather.png')
          }
          style={{
            width: horizontalScale(20),
            height: verticalScale(20),
            position: 'absolute',
            right: horizontalScale(10),
            top: verticalScale(15),
          }}
          ></Image>
        </Pressable>
      </View>
      <Pressable
      style={{
        width: horizontalScale(200),
        height: verticalScale(50),
        backgroundColor: '#01CBE4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: verticalScale(20),
      }}
      onPress={() => {
        props.navigation.navigate('HomeScreen');
      }}
      >
        <Text>
          DONE
        </Text>
      </Pressable>
      <BottomSheetModal
      ref={bottomSheetModalGenderRef}
      index={1}
      snapPoints={snapPoints}
      >
        <BottomSheetView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Pressable
          onPress={() => {
            setGender(1);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Male
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setGender(0);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Female
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setGender(2);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Pregnant
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setGender(3);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Breastfeeding
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setGender(4);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Prefer not to say
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
      ref={bottomSheetModalWeightRef}
      index={1}
      snapPoints={snapPoints}
      >
        <BottomSheetView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <BottomSheetTextInput
          placeholder='Enter your weight'
          keyboardType='numeric'
          onChangeText={(text) => {
            setWeight(text);
          }}
          />
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
      ref={bottomSheetModalActivityRef}
      index={1}
      snapPoints={snapPoints}
      >
        <BottomSheetView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        <Pressable
          onPress={() => {
            setActivityLevel(1);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Low Activity
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setActivityLevel(2);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Medium Activity
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setActivityLevel(3);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              High Activity
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
      ref={bottomSheetModalWeatherRef}
      index={1}
      snapPoints={snapPoints}
      >
        <BottomSheetView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
        <Pressable
          onPress={() => {
            setWeather(4);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Hot
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setWeather(3);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Warm
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setWeather(2);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Normal
            </Text>
          </Pressable>
          <Pressable
          onPress={() => {
            setWeather(1);
          }}
          style={{
            backgroundColor: '#01CBE4',
            width: horizontalScale(300),
            height: verticalScale(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginBottom: verticalScale(20),
          }}
          >
            <Text>
              Cold
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({

});

export default Recommend;
