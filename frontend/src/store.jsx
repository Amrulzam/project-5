import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import sideBarReducer from './features/sideBarSlice';
import chattingReducer from './features/chattingSlice';
import roomReducer from './features/roomSlice';
import socketReducer, { socketSlice } from './features/socketSlice';

export const store = configureStore({
    reducer:{
        userSlice:userReducer,
        sideBarSlice:sideBarReducer,
        chattingSlice:chattingReducer,
        roomSlice:roomReducer,
        socketSlice: socketReducer,
    },
})
