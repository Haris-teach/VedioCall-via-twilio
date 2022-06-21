import {View, Text, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';

const AudioCallScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/png/image.png')}
      style={{flex: 1}}
      resizeMode="cover">
      <LinearGradient
        colors={['rgba(5, 8, 17, 0)', 'rgba(5, 8, 17, 0.85)']}
        style={{flex: 1}}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <View>
          <Text>AudioCallScreen</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default AudioCallScreen;
