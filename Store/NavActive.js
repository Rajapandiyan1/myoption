import { createSlice } from "@reduxjs/toolkit";

let Navslice=createSlice({
    name:"NavbarActive",
initialState:{
    active:""
},
reducers:{
    setNavActive:function(state,action) {
        state.active=action.payload.active;
    }
}});
export const {setNavActive} = Navslice.actions;
export default Navslice.reducer;