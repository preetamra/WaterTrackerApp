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
    Dimensions,
    Pressable,
    Image
  } from 'react-native';
  /* import {
      Canvas,
      Circle,
      Group,
      Path,
      Skia,
      useFont,
    } from "@shopify/react-native-skia"; */
  import { line, curveBasis,area, scaleLinear } from 'd3';
  import { 
      useSharedValue,
      withRepeat,
      withTiming,
      useDerivedValue,
      Easing,
      SharedTransition,
      withSpring
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  

  import GlassOfWaterSvg from '../assets/glassOfWaterSvg';
import { horizontalScale, verticalScale } from '../Utils/ResponsiveDesign';
  
   const size = 200;
   const value = 45;
  
  const customTransition = SharedTransition.custom((values) => {
    'worklet';
    return {
      height: withSpring(verticalScale(values.targetHeight)),
      width: withSpring(horizontalScale(values.targetWidth)),
      originX: withSpring(values.targetOriginX),
      originY: withSpring(values.targetOriginY),
    };
  });
    
    function HomeScreen(props) {
      const radius = size * 0.5; // outer circle
      const circleThickness = radius * 0.05; // 0.05 just coefficient can be anything you like
    
      const circleFillGap = 0.05 * radius; // 0.05 just coefficient can be anything you like
      const fillCircleMargin = circleThickness + circleFillGap;
      const fillCircleRadius = radius - fillCircleMargin; // inner circle radius
    
      const minValue = 0; // min possible value
      const maxValue = 100; // max possible value
      const fillPercent = Math.max(minValue, Math.min(maxValue, value)) / maxValue; // percent of how much progress filled
    
      const waveCount = 1; // how many full waves will be seen in the circle
      const waveClipCount = waveCount + 1; // extra wave for translate x animation
      const waveLength = (fillCircleRadius * 2) / waveCount; // wave length base on wave count
      const waveClipWidth = waveLength * waveClipCount; // extra width for translate x animation
      const waveHeight = fillCircleRadius * 0.1; // wave height relative to the circle radius, if we change component size it will look same
    
      const fontSize = radius / 2; // font size is half of the radius
    
      // const text = `${value}`; // convert value to string
      const textWidth = 0; // get text width
      const textTranslateX = radius - textWidth * 0.5; // calculate text X position to center it horizontally
      const textTransform = [{ translateY: size * 0.5 - fontSize * 0.7 }]; // calculate vertical center position. Half canvas size - half font size. But since characters isn't centered inside font rect we do 0.7 instead of 0.5.
    
      // Data for building the clip wave area.
      // [number, number] represent point
      // we have 40 points per wave
      // we generate as many points as 40 * waveClipCount
      const data = [];
      for (let i = 0; i <= 40 * waveClipCount; i++) {
        data.push([i / (40 * waveClipCount), i / 40]);
      }
    
      const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveClipWidth
      const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]); // interpolate value between 0 and 1 to value between 0 and waveHeight
    
      // area take our data points
      // output area with points (x, y0) and (x, y1)
      const clipArea = area()
        .x(function (d) {
          return waveScaleX(d[0]); // interpolate value between 0 and 1 to value between 0 and waveClipWidth
        })
        .y0(function (d) {
          // interpolate value between 0 and 1 to value between 0 and waveHeight
          return waveScaleY(Math.sin(d[1] * 2 * Math.PI));
        })
        .y1(function (_d) {
          // same y1 value for each point
          return fillCircleRadius * 2 + waveHeight;
        });
    
      const clipSvgPath = clipArea(data); // convert data points as wave area and output as svg path string
    
      const translateXAnimated = useSharedValue(0); // animated value translate wave horizontally
      const translateYPercent = useSharedValue(0); // animated value translate wave vertically
      const textValue = useSharedValue(0); // animated value for text
    
      useEffect(() => {
        textValue.value = withTiming(value, { // animate from 0 to `value`
          duration: 1000, // duration of animation
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [value]);
    
      const text = useDerivedValue(() => { // derived value for the Text component
        return `${textValue.value.toFixed(0)}`; // convert to string 
      }, [textValue]);
    
      useEffect(() => {
        translateYPercent.value = withTiming(fillPercent, {
          // timing animation from 0 to `fillPercent`
          duration: 1000, // animation duration
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [fillPercent]);
    
      useEffect(() => {
        translateXAnimated.value = withRepeat(
          // repeat animation
          withTiming(1, {
            // animate from 0 to 1
            duration: 9000, // animation duration
            easing: Easing.linear, // easing function
          }),
          -1, // repeat forever
        );
      }, []);
    
      /* const clipPath = useDerivedValue(() => {
        // animated value for clip wave path
        // const clipP = Skia.Path.MakeFromSVGString(clipSvgPath); // convert svg path string to skia format path
        // const transformMatrix = Skia.Matrix(); // create Skia tranform matrix
        transformMatrix.translate(
          fillCircleMargin - waveLength * translateXAnimated.value, // translate left from start of the first wave to the length of first wave
          fillCircleMargin +
            (1 - translateYPercent.value) * fillCircleRadius * 2 -
            waveHeight, // translate y to position where lower point of the wave in the innerCircleHeight * fillPercent
          // since Y axis 0 is in the top, we do animation from 1 to (1 - fillPercent)
        );
        clipP.transform(transformMatrix); // apply transform matrix to our clip path
        return clipP;
      }, [translateXAnimated, translateYPercent]); */
      // const clipPath = clipP;
  
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
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          >
            <View>
              <Button
              title='Calender'
              onPress={() => {
                props.navigation.navigate('CalenderScreen');
              }}
              ></Button>
            </View>
          <Text>
              Water Intake Tracker
          </Text>
          <View>
              <Button
              title='Settings'
              onPress={() => {
                props.navigation.navigate('SettingScreen');
              }}
              ></Button>
            </View>
          </View>
          <View
          style={{
            flex:5,
            position:"relative",
            width:horizontalScale(450),
            height:verticalScale(450),
          }}>
            <Image
             source={
                require('../assets/newOnlyTurtle.png')
             }
             style={{
                width: horizontalScale(450),
                height: verticalScale(450),
                backgroundColor:"transparent",
                zIndex: 1,
                resizeMode:"contain",
                opacity:1,
             }}
             >
             </Image>
             {/* <Image
             source={
                require('../assets/newOnlyBackgroundTurtle.png')
             }
             style={{
                 width: 450,
                 height: 450,
                 backgroundColor:"red",
                 zIndex: 1,
                 resizeMode:"contain",
                  position:"absolute",
                  top:0,
                  bottom:0,
                  left:0,
                  right:0,
                  zIndex:2,
                  transform: [{ scale:1.5 }]
             }}
             >
             </Image> */}
             <View
             style={{
              width: horizontalScale(450),
              height: verticalScale(15),
              position: 'absolute',
              left: horizontalScale(0),
              bottom: 265,
              right: horizontalScale(0),
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              flex:1,      
              backgroundColor: '#00BEDE',      
             }}
             ></View>
          </View>
          <Animated.View
          style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: verticalScale(20),
          }}
          /* sharedTransitionTag='addWaterScreen'
          sharedTransitionStyle={customTransition} */
          >
             <Pressable
             onPress={() => {
              props.navigation.navigate('AddWaterScreen');
             }}
             >
              <GlassOfWaterSvg/>
             </Pressable>
          </Animated.View>
        </SafeAreaView>
      );
  }
    
  export default HomeScreen;
    