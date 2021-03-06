


import React, {useState,useEffect} from 'react';
import { View, StyleSheet, NativeModules, Platform } from 'react-native';
import { RtcEngine, AgoraView } from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { Agora } = NativeModules;                  //Define Agora object as a native module

const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Adaptative,
} = Agora;                                        //Set defaults for Stream

const Video=()=>{

    const [peerIds,setPeerIds] = useState([]);
    const [uid,setUid] = useState( Math.floor(Math.random() * 100));
    const [appid,setAppid] = useState('9bdf767edba54d2db82ef1bed9df6b2b');
    const [channelName,setChannelName] = useState('room');
    const [vidMute,setVidMute] = useState(false);
    const [audMute,setAudMute] = useState(false);
    const [joinSucceed,setJoinSucceed] = useState(false);

    
    useEffect(()=>{

        if (Platform.OS === 'android') {
            const config = {                            //Setting config of the app
                appid: appid,                  //App ID
                channelProfile: 0,                        //Set channel profile as 0 for RTC
                mode: 1,
                videoEncoderConfig: {                     //Set Video feed encoder settings
                    width: 720,
                    height: 1080,
                    bitrate: 1,
                    frameRate: FPS30,
                    orientationMode: Adaptative,
                },
                audioProfile: AudioProfileDefault,
                audioScenario: AudioScenarioDefault,
            };
            RtcEngine.init(config);                     //Initialize the RTC engine
        }
        RtcEngine.on('userJoined', (data) => {
                     //Get currrent peer IDs
            if (peerIds.indexOf(data.uid) === -1) {     //If new user has joined
                    setPeerIds([...peerIds, data.uid])        //add peer ID to state array
            }
        });
        RtcEngine.on('userOffline', (data) => {       //If user leaves
                setPeerIds(peerIds.filter(uid => uid !== data.uid)) //remove peer ID from state array
        });
        RtcEngine.on('joinChannelSuccess', (data) => {                   //If Local user joins RTC channel
            RtcEngine.startPreview();                                      //Start RTC preview
                setJoinSucceed(true),                                          //Set state variable to true
        });
        RtcEngine.joinChannel(channelName, .uid);  //Join Channel
        RtcEngine.enableAudio();     
    },[])

   
   const toggleAudio = () => {
        let mute = audMute;
        console.log('Audio toggle', mute);
        RtcEngine.muteLocalAudioStream(!mute);
    
            setAudMute(!mute)
        
    }

   const toggleVideo = () => {
        let mute = vidMute;
        console.log('Video toggle', mute);
       
            setVidMute(!mute)
  
        RtcEngine.muteLocalVideoStream(!vidMute);
    }

    const endCall=()=> {
        RtcEngine.destroy();
        Actions.home();
    }
    const videoView=()=> {
        return (
            <View style={{ flex: 1 }}>
                {
                    peerIds.length > 3                                     //view for four videostreams
                        ? <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 / 2, flexDirection: 'row' }}><AgoraView style={{ flex: 1 / 2 }}
                                remoteUid={peerIds[0]}
                                mode={1} />
                                <AgoraView style={{ flex: 1 / 2 }}
                                    remoteUid={peerIds[1]}
                                    mode={1} /></View>
                            <View style={{ flex: 1 / 2, flexDirection: 'row' }}><AgoraView style={{ flex: 1 / 2 }}
                                remoteUid={.peerIds[2]}
                                mode={1} />
                                <AgoraView style={{ flex: 1 / 2 }}
                                    remoteUid={peerIds[3]}
                                    mode={1} /></View>
                        </View>
                        : peerIds.length > 2                                 //view for three videostreams
                            ? <View style={{ flex: 1 }}>
                                <View style={{ flex: 1 / 2 }}><AgoraView style={{ flex: 1 }}
                                    remoteUid={peerIds[0]}
                                    mode={1} /></View>
                                <View style={{ flex: 1 / 2, flexDirection: 'row' }}><AgoraView style={{ flex: 1 / 2 }}
                                    remoteUid={peerIds[1]}
                                    mode={1} />
                                    <AgoraView style={{ flex: 1 / 2 }}
                                        remoteUid={peerIds[2]}
                                        mode={1} /></View>
                            </View>
                            : peerIds.length > 1                              //view for two videostreams
                                ? <View style={{ flex: 1 }}><AgoraView style={{ flex: 1 }}
                                    remoteUid={peerIds[0]}
                                    mode={1} /><AgoraView style={{ flex: 1 }}
                                        remoteUid={peerIds[1]}
                                        mode={1} /></View>
                                : peerIds.length > 0                             //view for videostream
                                    ? <AgoraView style={{ flex: 1 }}
                                        remoteUid={peerIds[0]}
                                        mode={1} />
                                    : <View />
                }
                {
                    !vidMute                                              //view for local video
                        ? <AgoraView style={styles.localVideoStyle} zOrderMediaOverlay={true} showLocalVideo={true} mode={1} />
                        : <View />
                }
                <View style={styles.buttonBar}>
                    <Icon.Button style={styles.iconStyle}
                        backgroundColor="#0093E9"
                        name={audMute ? 'mic-off' : 'mic'}
                        onPress={() => toggleAudio()}
                    />
                    <Icon.Button style={styles.iconStyle}
                        backgroundColor="#0093E9"
                        name="call-end"
                        onPress={() => endCall()}
                    />
                    <Icon.Button style={styles.iconStyle}
                        backgroundColor="#0093E9"
                        name={vidMute ? 'videocam-off' : 'videocam'}
                        onPress={() => toggleVideo()}
                    />
                </View>
            </View>
        );
    }

    
        return videoView();
    
}

const styles = StyleSheet.create({
    buttonBar: {
        height: 50,
        backgroundColor: '#0093E9',
        display: 'flex',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    localVideoStyle: {
        width: 140,
        height: 160,
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 100,
    },
    iconStyle: {
        fontSize: 34,
        paddingTop: 15,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 15,
        borderRadius: 0,
    },
});

export default Video;
