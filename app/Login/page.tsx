'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch} from 'react-redux';
import { setNavActive } from '@/Store/NavActive';
import Link from 'next/link';
import { setDashPath } from '@/Store/DashboardPath';
import { setAthen } from '@/Store/Athen';

function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const NavActive=useDispatch();
    const route=useRouter();
    const [error, setError] = useState('');
    const [submit,setsubmit]=useState(false);
    
useEffect(()=>{
NavActive(setNavActive({active:"Login"}))
},[])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setsubmit(true)
        try {
             await axios.post(`https://server-1-nu7h.onrender.com/login`, {
                email,
                password,
            }, {
                withCredentials:true,
                headers: {
                    
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"*"
                    
                },
                // withCredentials:true
            }).then(async(data)=>{
                
                const datas=data.data;
                if(!datas.ok)
                    throw datas;
               await NavActive(setAthen({Athen:true}))
               await NavActive(setDashPath({path:`${datas.url}`}))
                route.push(datas.url);
            }).catch((e)=>{
            
                setError(e.message);
            }).finally(()=>{
                setsubmit(false)
            })
            // Handle successful login, e.g., redirect or store user info
        } catch (e) {
            setError(e.message)
            // Handle error, set error message
            await NavActive(setAthen({Athen:false}))

        }
    };

    return (
        <div className="log" style={{ minHeight: '90vh', display: 'flex', alignContent: 'center' }}>
            <div className="h-100 bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-xs mx-auto my-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form suppressHydrationWarning={true} id="loginForm"  className='my-auto'>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input disabled={submit}
                            type="email" 
                            id="email" 
                            placeholder="your.email@example.com" 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input 
                            disabled={submit}
                            type="password" 
                            id="password" 
                            
                            placeholder="********" 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                       
                    </div>
                    {submit && <div className="flex items-center justify-center">
  <span className="loader border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
</div>}
                    {error  && <p className="text-red-500 mb-5 text-xs mt-1">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button disabled={submit} onClick={(e)=>{handleSubmit(e)}} 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Sign In
                        </button>
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/ForgotPassword">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Page;
