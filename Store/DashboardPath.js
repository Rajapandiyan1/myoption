import { createSlice } from "@reduxjs/toolkit";
import path from "path";

let DashboardPath=createSlice({
    name:"Dashboard",
    initialState:{
        path:''
    },
    reducers:{
        setDashPath:(state,action)=>{
            state.path=''
state.path=action.payload.path;
        }
    }
})

export default DashboardPath.reducer;
export const {setDashPath} = DashboardPath.actions