'use client'
import { setAthen } from '@/Store/Athen';
import { setDashPath } from '@/Store/DashboardPath';
import { setNavActive } from '@/Store/NavActive';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Register = () => {
    const NavActive=useDispatch();
    const NavActive1=useDispatch();

    const route=useRouter()
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
useEffect(()=>{
    NavActive(setNavActive({active:"Register"}))
},[])
    const [errors, setErrors] = useState({username:'',email:'',password:'',confirmPassword:''});

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    const validate = () => {
        const newErrors = {username:'',email:"",password:'',confirmPassword:''};
       
        if (!formData.fullname) newErrors.username = 'Username is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
        if (!formData.password) newErrors.password = 'Password is required.';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match.';
        setErrors(newErrors);
        if(!formData.fullname && !formData.email && !formData.confirmPassword && !formData.password) return false
        return true
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        
        if (validate()) {
            // Handle successful registration (e.g., API call)
            axios.post(`https://server-1-nu7h.onrender.com/register`,{email:formData.email,fullname:formData.fullname,password:formData.password},{
                withCredentials:true

                
            }).then((data)=>{
                const dat=data.data;
                if(!dat.ok) throw dat
                    NavActive1(setAthen({Athen:true}))
                    NavActive(setDashPath({path:`${dat.url}`}))
                    route.push(dat.url)
                setToastType('success');
                setToastMessage(dat.message)

            }).catch((e)=>{
                setToastType('faild');
                setToastMessage(e.message);
                NavActive1(setAthen({Athen:false}))

            })
        }
    };

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage('');
                setToastType('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);
    return (
      <div data-bs-spy="Scroll" data-bs-target="#nav" style={{minHeight:'90vh',display:'flex',alignContent:'center'}}>
        {toastMessage && (
                <div className={`fixed top-20 z-20 right-4 max-w-xs w-full p-4 rounded-md shadow-lg transition-opacity duration-300 
                    ${toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} 
                    animate-fadeIn`}>
                    {toastMessage}
                </div>
            )}
        <div className="my-auto bg-white shadow-md rounded-lg p-6 sm:p-8  max-w-xs mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            <form suppressHydrationWarning={true} onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="fullname"
                        placeholder="Your Username" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        value={formData.fullname} 
                        onChange={handleChange} 
                        required />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="your.email@example.com" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="********" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        placeholder="********" 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 mr-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Register
                    </button>
                    <Link  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/Login">
                        Already have an account?
                    </Link >
                </div>
            </form>
        </div>
      </div>
    );
};

export default Register;
