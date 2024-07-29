import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import { horizontalScale, verticalScale } from '../Utils/ResponsiveDesign';

const { width, height } = Dimensions.get('window');

const RedOverlayImage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./asset1.png")}
        style={styles.image}
      />
      <View style={styles.redOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: horizontalScale(400),   // Adjust width as needed
    height: verticalScale(400), // Adjust height as needed
  },
  redOverlay: {
    position: 'absolute',
    top: '20%',      // Adjust top position as needed
    left: '20%',     // Adjust left position as needed
    width: '60%',    // Adjust width as needed
    height: '60%',   // Adjust height as needed
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red
  },
});

export default RedOverlayImage;
