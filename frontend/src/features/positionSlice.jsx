import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    x: 100,
    y: 0
}

export const positionSlice = createSlice({
    name:'positionSlice',
    initialState,
    reducers:{
        setPosition:(state,action)=>{
            const {x_cor,y_cor} = action.payload;
            state.x= x_cor+25;
            state.y= y_cor-60;
        }
    }
})

export const {setPosition} = positionSlice.actions;
export default positionSlice.reducer;
