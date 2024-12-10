import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    select:1,
};

export const sideBarSlice = createSlice({
    name: "sideBarSlice",
    initialState,
    reducers: {
        setSelect: (state, action) => {
            const { selectedInd } = action.payload;
            state.select=selectedInd;
        }
    },
});


export const { setSelect } = sideBarSlice.actions;

export default sideBarSlice.reducer;

