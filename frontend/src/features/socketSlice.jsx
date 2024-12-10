import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

const initialState = {
    socket: null, // Use null instead of an empty string for better type clarity
};

export const socketSlice = createSlice({
    name:"socketSlice",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            const { socket } = action.payload;
            if (socket instanceof Socket) { // Ensures it's a valid Socket instance
                state.socket = socket;
            } else {
                console.error("Invalid socket instance provided.");
            }
        },
    },

})

export const selectSocket = (state) => state.socketSlice.socket;
export const {setSocket} = socketSlice.actions;
export default socketSlice.reducer;
