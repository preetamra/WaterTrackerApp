import React,{
  useEffect,
  useState
} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Recommend(props) {

  const [selectedLanguage, setSelectedLanguage] = useState();

  const [gender, setGender] = useState();
  const [weight, setWeight] = useState("0");
  const [activityLevel, setActivityLevel] = useState("2");
  const [weather, setWeather] = useState("2");

  const [recommededWaterIntake, setRecommededWaterIntake] = useState(0);

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
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
      <Text>
        Recommeded water intake
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
        fontSize: 20,
        fontWeight: 'bold',
      }}
      >
        {recommededWaterIntake.toFixed(2)}
      </Text>
      </View>
      <View 
      style={{
        flex:7
      }}
      >
      <View
      style={{
        flex:1,
      }}
      >
      <Text>Gender</Text>
      <Picker
      style={{
        width:200,
      }}
        selectedValue={gender}
        onValueChange={(itemValue, itemIndex) =>
          setGender(itemValue)
        }>
        <Picker.Item label="Male" value="2" />
        <Picker.Item label="Female" value="1" />
        <Picker.Item label="Pregnant" value="3" />
        <Picker.Item label="Breastfeeding" value="4" />
        <Picker.Item label="Prefer not to say" value="0" />
      </Picker>
      </View>
      <View
        style={{
        }}
      >
      <Text>Weight</Text>
      <TextInput
      returnKeyType='done'
      style={{
        width:200,
        height:40,
        borderColor: 'gray',
        borderWidth: 1
      }}
      value={weight}
      onChangeText={setWeight}
      keyboardType='numeric'      
      ></TextInput>
      </View>
      <View
            style={{
              flex:1
            }}
      >
      <Text>Activity</Text>
      <Picker
      style={{
        width:200,
      }}
        selectedValue={activityLevel}
        onValueChange={(itemValue, itemIndex) =>
          setActivityLevel(itemValue)
        }>
        <Picker.Item label="Low Acitvity" value="1" />
        <Picker.Item label="Medium Acitvity" value="2" />
        <Picker.Item label="High Acitvity" value="3" />
      </Picker>
      </View>
      <View
        style={{
          flex:1
        }}
      >
      <Text>Weather</Text>
      <Picker
      style={{
        width:200,
      }}
        selectedValue={weather}
        onValueChange={(itemValue, itemIndex) =>
          setWeather(itemValue)
        }>
        <Picker.Item label="Cold" value="1" />
        <Picker.Item label="Normal" value="2" />
        <Picker.Item label="Warm" value="3" />
        <Picker.Item label="Hot" value="4" />
      </Picker>
      </View>
      </View>
      <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <Button
        title='Done'
        onPress={() => {
          props.navigation.navigate('HomeScreen');
          storeData('setUpComplete',"true");
        }}
        ></Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});

export default Recommend;
