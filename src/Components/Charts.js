import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { verticalScale, moderateScale } from '../Utils/ResponsiveDesign';
import { color } from 'd3';

const App = (props) => {
    return(
        <View
                style={{
                  flex:5,
                  flexDirection:'row',
                  justifyContent:'space-between',
                  alignItems:'flex-end',
                  marginBottom:verticalScale(20),
                  marginTop:verticalScale(20),
                }}
                >
                    {props?.data?.map((item,index) => {
                        return(
<View
                  style={{
                    backgroundColor:'#f9fbfa',
                    height:'100%',
                  }}
                  >
                    <View
                    style={{
                      height:'80%',
                      justifyContent:'flex-end',
                    }}
                    >
                      <View
                      style={{
                        height:`${100-item?.value}%`,
                      }}
                      ></View>
                      <View
                      style={{
                        height:`${item?.value}%`,
                        backgroundColor:'#00bedd',
                        borderRadius:moderateScale(8.25),
                      }}
                      >
                        <Text
                        style={{
                            textAlign:'center',
                            marginTop:verticalScale(-25),
                            color:'#00bedd',
                            fontWeight:'bold',
                            fontSize:moderateScale(16),
                        }}
                        >
                            {item?.value}
                        </Text>
                      </View>
                    </View>
                    <Text
                    style={{
                      textAlign:'center',
                      marginTop:verticalScale(10),
                      color:'#C6C7C9'
                    }}
                    >
                      {"   "}{
                        item?.label
                      }{"   "}
                    </Text>
                  </View>
                        )
                    })}
                </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chart: {
    height: 200,
    marginBottom: 20,
  },
  bar: {
    width: 25,
    borderRadius: 5,
  },
  layeredBar: {
    width: 25,
    borderRadius: 5,
    overflow: 'hidden',
  },
  layeredBarSection: {
    flex: 1,
  },
  barValue: {
    fontSize: 12,
    marginBottom: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
  },
});

export default App;