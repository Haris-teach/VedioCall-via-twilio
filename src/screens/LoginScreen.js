import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {IsLogin} from '../redux/Reducer/mainReducer';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');

  const _checkPermissions = callback => {
    const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    const androidPermissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    checkMultiple(
      Platform.OS === 'ios' ? iosPermissions : androidPermissions,
    ).then(statuses => {
      const [CAMERA, AUDIO] =
        Platform.OS === 'ios' ? iosPermissions : androidPermissions;
      if (
        statuses[CAMERA] === RESULTS.UNAVAILABLE ||
        statuses[AUDIO] === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(
          'Error',
          'Hardware to support video calls is not available',
        );
      } else if (
        statuses[CAMERA] === RESULTS.BLOCKED ||
        statuses[AUDIO] === RESULTS.BLOCKED
      ) {
        Alert.alert(
          'Error',
          'Permission to access hardware was blocked, please grant manually',
        );
      } else {
        if (
          statuses[CAMERA] === RESULTS.DENIED &&
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          requestMultiple(
            Platform.OS === 'ios' ? iosPermissions : androidPermissions,
          ).then(newStatuses => {
            if (
              newStatuses[CAMERA] === RESULTS.GRANTED &&
              newStatuses[AUDIO] === RESULTS.GRANTED
            ) {
              callback && callback();
            } else {
              Alert.alert('Error', 'One of the permissions was not granted');
            }
          });
        } else if (
          statuses[CAMERA] === RESULTS.DENIED ||
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          request(statuses[CAMERA] === RESULTS.DENIED ? CAMERA : AUDIO).then(
            result => {
              if (result === RESULTS.GRANTED) {
                callback && callback();
              } else {
                Alert.alert('Error', 'Permission not granted');
              }
            },
          );
        } else if (
          statuses[CAMERA] === RESULTS.GRANTED ||
          statuses[AUDIO] === RESULTS.GRANTED
        ) {
          callback && callback();
        }
      }
    });
  };

  const HitAPI = () => {
    var axios = require('axios');
    var config = {
      method: 'get',
      url: `http://192.168.0.34:3000/getToken/?userName=${userName}`,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        dispatch(
          IsLogin({
            userName: userName,
            roomName: roomName,
            token: response.data,
          }),
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    _checkPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={{color: 'white'}}>User Name</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={userName}
          onChangeText={text => setUserName(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={{color: 'white'}}>Room Name</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={roomName}
          onChangeText={text => setRoomName(text)}
        />
      </View>
      <View style={styles.formGroup}>
        <TouchableOpacity
          disabled={false}
          style={styles.button}
          onPress={() => {
            dispatch(
              IsLogin({
                userName: "",
                roomName: "",
                token: "",
              }),
          }}>
          <Text style={{color: 'white'}}>Connect to Video Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black', justifyContent: 'center'},
});
