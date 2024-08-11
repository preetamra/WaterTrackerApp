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
    Pressable,
    Animated,
    FlatList,
    Switch
} from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../Utils/ResponsiveDesign';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useSQLiteContext } from 'expo-sqlite';
import { useSelector, useDispatch } from 'react-redux';
import { categoryActions } from '../store/categoriesSlice';
  
function EditDrinkList(props) {
  const [categories, setCategories] = useState([]);

  const categoriesList = useSelector((state) => state.categories.value);
  const dispatch = useDispatch();

  const db = useSQLiteContext();

  const [loaded, error] = useFonts({
    "Mplus-Black": require("../../assets/fonts//Mplus-Black.ttf"),
    "Mplus-Bold": require("../../assets/fonts//Mplus-Bold.ttf"),
    "Mplus-ExtraBold": require("../../assets/fonts//Mplus-ExtraBold.ttf"),
    "Mplus-Light": require("../../assets/fonts//Mplus-Light.ttf"),
    "Mplus-Medium": require("../../assets/fonts//Mplus-Medium.ttf"),
    "Mplus-Regular": require("../../assets/fonts//Mplus-Regular.ttf"),
    "Mplus-Thin": require("../../assets/fonts//Mplus-Thin.ttf"),
    "CoreSans-ExtraBold": require("../../assets/fonts//CoreSans-ExtraBold.ttf"),
    "Fact-Narrow-Bold": require("../../assets/fonts//Fact-Narrow-Bold.ttf")
  });

  const getData = async () => {
    try {
        const value = await db.getAllAsync('SELECT * FROM Categories');
        setCategories(value);

        dispatch(categoryActions.allCategoriesList(value));

        const value1 = await db.getAllAsync('SELECT * FROM Categories WHERE enabled = 1');
        dispatch (categoryActions.allEnabledCategoriesList(value1));

    } catch (e) {
      // error reading value
      console.error(e);
    }
  }

  useEffect( () => {
     (
        async() => {
            try{
               await getData();
            }catch(e){
                console.error(e);
            }
        }
     )()
  }, []);

    return (
    <GestureHandlerRootView
    style={{
      flex:1,
      width:horizontalScale(450),
      height:verticalScale(450),
      backgroundColor: '#ffffff',
    }}
    >
      <SafeAreaView style={{
        flex: 1,
      }}>
          <View
          style={{
            position:"absolute",
            top:10,
            left:10,
            width:horizontalScale(50),
            height:horizontalScale(50),
            zIndex: 2,
          }}
          >
            <Pressable
            onPress={() => {
                props.navigation.goBack();
            }}
            style={{
              width:'100%',
              height:'100%',
            }}
            >
              <Image
               source={require('../assets/BackButton.png')}
               style={{
                  width: horizontalScale(50),
                  height: verticalScale(50),
                  backgroundColor:"transparent",
                  zIndex: 1,
                  resizeMode:"contain"
               }}
              ></Image>
            </Pressable>
          </View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              flex:1,
              width:"83%",
              position:"relative",
              top:0,
              bottom:0,
              left:0,
              right:0,
              zIndex:1,
              marginTop:verticalScale(80),
            }}
            contentContainerStyle={{
              justifyContent:'center',
              alignItems:'center',
            }}
          >
            <View
            style={{
            }}
            >
                <Text
                style={{
                    color:'#464B51',
                    fontSize:moderateScale(28),
                    fontFamily:'Mplus-ExtraBold',
                }}
                >
                    Add/Edit drinks list
                </Text>
            </View>
            <Pressable
            style={{
                backgroundColor:'#4FB1CF',
                padding:moderateScale(20),
                borderRadius:moderateScale(87),
                marginTop:moderateScale(30),
            }}
            >
                <Image></Image>
                <Text
                style={{
                    color:'#ffffff',
                    fontSize:moderateScale(20),
                    fontFamily:'Mplus-Bold'
                }}
                >
                    CREATE NEW DRINK
                </Text>
            </Pressable>
            <Text
            style={{
                color:'#A2A2A0',
                fontSize:moderateScale(15),
                fontFamily:'Mplus-Bold',
                marginTop:moderateScale(30),
                textAlign:'center',
                marginLeft:horizontalScale(20),
                width:"80%"
            }}
            >
                Toggle all the drinks you want to be shown in the home screen. Or Change the cup size of the drinks.
            </Text>
            <View
            style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'space-between',
                width:'100%',
                marginTop:moderateScale(30),
                paddingHorizontal:moderateScale(30),
                paddingVertical:moderateScale(15),
            }}
            >
             <Text
             style={{
                flex:2,
                fontSize:moderateScale(10),
                color:'#B0B0AF'
             }}
             numberOfLines={1}
             >
                DRINK NAME
             </Text>
             <Text
             style={{
                flex:1,
                fontSize:moderateScale(10),
                color:'#B0B0AF'
             }}
             numberOfLines={1}
             >
                CUP SIZE
              </Text>
              <Text
              style={{
                flex:1,
                fontSize:moderateScale(10),
                color:'#B0B0AF'
              }}
              numberOfLines={1}
              >
                HYDRATION
              </Text>        
            </View>
            {
            categoriesList.length != 0 &&
            <FlatList
            data={categoriesList}
            renderItem={(item) => {
               return(
                <View
                style={{
                    flex:1,
                    flexDirection:'row',
                    justifyContent:'space-between',
                    width:'100%',
                    marginTop:moderateScale(30),
                    paddingHorizontal:moderateScale(30)
                }}
                >
                 <Text
                 style={{
                    flex:2,
                    fontSize:moderateScale(18),
                    color:'#363C49',
                    fontFamily:'Inter',
                    fontWeight:'bold',
                 }}
                 numberOfLines={1}
                 >
                    {
                        item.item.name
                    }
                 </Text>
                 <View>
                    <Text
                    style={{
                        color:'#5BB6CF',
                        fontSize:moderateScale(15),
                        fontWeight:'600',
                        fontFamily:'Mplus-Bold'
                    }}
                    >
                        {
                            item.item.size
                        }
                        ml
                    </Text>
                 </View>
                 <View
                 style={{
                    flex:1,
                    marginLeft:moderateScale(20),
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                 }}
                 >
                 <Text
                  style={{
                    fontSize:moderateScale(15),
                    fontFamily:'Mplus-Bold',
                    color:'#979593',
                  }}
                  numberOfLines={1}
                  >
                    {
                        item.item.hydration
                    }
                    %
                  </Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={(item.item.enabled == 1) ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => {
                        (
                            async() => {
                                try{
                                    await db.withTransactionAsync(
                                        async() => {
                                            try{
                                                await db.runAsync('UPDATE Categories SET enabled = ? WHERE id = ?', [value ? 1 : 0, item.item.id]);
                                                await getData();
                                            }catch(e){
                                                console.error(e);
                                            }
                                        }
                                    )
                                    console.log("withTransactionAsync end");
                                }catch(e){
                                    console.error(e);
                                }
                            }
                        )()
                    }}
                    value={(item.item.enabled == 1)}
                 />
                 </View>
                </View>
               )
            }}
            style={{
                width:'100%',
                height:'100%',
                flex:1
            }}
            ></FlatList>
        }
          </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
  
export default EditDrinkList;
  