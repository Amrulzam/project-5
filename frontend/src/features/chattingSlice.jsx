import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    img: "assets/pic4.jpg",
    name: "",
    _state: "",
    id:"",
    messages:[]
}

export const chattingSlice = createSlice({
    name:"chattingSlice",
    initialState,
    reducers:{
        setChatting: (state,action)=>{
            const {userName, userState, userImg,userId,userMessages} = action.payload;
            state.img= userImg;
            state.name= userName;
            state._state=userState;
            state.id= userId;
            state.messages= userMessages;
        },
        setMessages: (state,action)=>{
            const {userMessages} = action.payload;
            state.messages = userMessages;
        },
        setDefault:(state)=>{
            state.img="";
            state.name="";
            state._state="";
            state.id= "";
            state.messages= [];
        }
    }
})

export const {setChatting,setDefault,setMessages} = chattingSlice.actions;

export default chattingSlice.reducer;
