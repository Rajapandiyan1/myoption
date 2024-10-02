'use client'
import React from 'react'
import Navbar from './Navbar'
import { Provider} from 'react-redux'
import Store from '../Store/HoleStore'
const body=function Body({children}:any) {
 
  return (
    <>
<Provider store={Store}>

    <Navbar/>
  

    {children}
    
</Provider>
    </>
  )
}

export default body