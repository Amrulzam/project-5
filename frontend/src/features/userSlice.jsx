import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName:"",
    email:"",
    id:"",
    lastSeen:""
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { userName, email, id,lastSeen } = action.payload;
            state.userName = userName;
            state.email = email;
            state.id = id;
            state.lastSeen=lastSeen;
        },
        clearUser: (state,action) => {
            const {lastSeen} = action.payload;
            state.userName = "";
            state.email = "";
            state.id = "";
            lastSeen= lastSeen;

        },
    },
});


export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
