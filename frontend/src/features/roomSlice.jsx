import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    room:""
}

export const roomSlice = createSlice({
    name:"roomSlice",
    initialState,
    reducers:{
        setRoom:(state,action)=>{
            const [roomId] = action.payload;
            state.room= roomId;
        }
    }
})

export const {setRoom} = roomSlice.actions;
export default roomSlice.reducer;
