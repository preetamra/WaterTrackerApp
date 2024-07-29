import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { horizontalScale, verticalScale } from '../Utils/ResponsiveDesign';
export default () => {
  const [headerShown, setHeaderShown] = useState(false);
  
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: verticalScale(0),
          left: horizontalScale(0),
          right: horizontalScale(0),
          height: verticalScale(80),
          backgroundColor: 'tomato',
          transform: [
            { translateX: headerShown ? 0 : - 100 },
          ],
        }}
      />
      
      <ScrollView
        onScroll={(event) => {
          const scrolling = event.nativeEvent.contentOffset.y;
          
          if (scrolling > 100) {
            setHeaderShown(true);
          } else {
            setHeaderShown(false);
          }
        }}
        // onScroll will be fired every 16ms
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, height: 1000 }} />
      </ScrollView>
    </>
  );
}