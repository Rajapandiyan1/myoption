const { createSlice } = require("@reduxjs/toolkit");

const athen=createSlice({
    name:'Athentication',
    initialState:{
        Athen:false
    },
    reducers:{
        setAthen:(state,action)=>{
            state.Athen=action.payload.Athen;
        }
    }
})

export default athen.reducer;
export const {setAthen} = athen.actions