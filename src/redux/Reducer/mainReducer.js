import {createSlice} from '@reduxjs/toolkit';

export const mainslice = createSlice({
  name: 'main',
  initialState: {
    isLogin: false,
    isAudioEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    userName: '',
    roomName: '',
    token: '',
  },
  reducers: {
    IsLogin: (state, action) => {
      state.isLogin = true;
      state.userName = action.payload.userName;
      state.roomName = action.payload.roomName;
      state.token = action.payload.token;
    },
    IsLogout: (state, action) => {
      state.isLogin = false;
    },
    CallConnection: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {IsLogin, IsLogout, CallConnection} = mainslice.actions;

export default mainslice.reducer;
