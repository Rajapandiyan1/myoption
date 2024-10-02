const { configureStore, combineReducers } = require("@reduxjs/toolkit");
const Navactive = require('../Store/NavActive');
const AthenPerson = require('../Store/Athen')
const DashboardPath = require('../Store/DashboardPath')

let store=configureStore({
    devTools:true,
    reducer:{
        Navbars:combineReducers( Navactive),
        Authentication:combineReducers(AthenPerson),
        DashPath:combineReducers(DashboardPath)
    }
})

export default store