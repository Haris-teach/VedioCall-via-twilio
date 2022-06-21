//=================================== React Native Import Files =====================

import React, {useRef, useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import AudioCallScreen from '../screens/AudioCallScreen';
import Video from '../screens/AgoraCall';

const RootStack = createNativeStackNavigator();
const Stack = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.main.isLogin);

  const AfterLoginAppContainer = () => {
    return (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerMode: 'none',
            headerShown: false,
          }}>
          <RootStack.Screen name={'Home'} component={Video} />

          {/* <RootStack.Screen name={'Home'} component={HomeScreen} />
          <RootStack.Screen name={'Audio'} component={AudioCallScreen} /> */}
        </RootStack.Navigator>
      </NavigationContainer>
    );
  };

  const BeforeLoginAppContainer = () => {
    return (
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerMode: 'none',
            headerShown: false,
          }}>
          <RootStack.Screen name="LoginScreen" component={LoginScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  };

  if (isLogin == false) {
    return <BeforeLoginAppContainer />;
  } else {
    return <AfterLoginAppContainer />;
  }
};
export default Stack;
