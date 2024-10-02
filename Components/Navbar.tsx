'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setAthen } from '@/Store/Athen';
import { setDashPath } from '@/Store/DashboardPath';

const Navbar = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navact = useSelector((state:any) => { return state.Navbars.default} );
  const dashpath=useSelector((state:any) => { return state.DashPath.default} );
  const authens=useSelector((state:any) => { return state.Authentication.default} );
  const dispatches = useDispatch();
  const [dashboard,setdashboard]=useState('');

  useEffect(()=>{
    fetch(`https://server-1-nu7h.onrender.com/authperson`,{
      credentials:'include',
      headers:{
        'Content-Type':"application/json",
        
      },
    }).then((data)=>{
      return data.json()
    }).then((data)=>{
      if(!data.ok) throw data;
      dispatches(setAthen({Athen:true}))
      dispatches(setDashPath({path:'Dashboard'+data.dashboardUrl}))
    });
  },[])
  
  useEffect(()=>{
    setdashboard(dashpath.path)
      },[dashpath.path])
  return (
    <nav className="bg-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-white">MYOPTION</div>
          <div className="hidden sm:flex sm:ml-6 space-x-4">
            <Link  href="/" className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  navact.active === 'Home' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300'
                }`}>
                Home
            </Link>
            {authens.Athen && <Link className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  navact.active === 'Dashboard' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300'
                }`} href={'https://myoption-git-master-rajapandiyan1s-projects.vercel.app/'+dashboard} >
                Dashboard
            </Link>}
            
            <Link className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  navact.active === 'Register' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300'
                }`}
                 href="/Register" >
                Register
            </Link>
            <Link className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                  navact.active === 'Login' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300'
                }`}
                
               href="/Login" >
              
                Login
            
            </Link>
          </div>
          <div className="-mr-2 flex sm:hidden me-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white inline-flex items-center justify-center p-2 rounded-md"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden sticky`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link   className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                navact.active === 'Home' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300'
              }`} href="/">
              Home
          </Link>
      {authens.Athen && <Link className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                navact.active === 'Dashboard' ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-300'
              }`}
              
             href={'https://myoption-git-master-rajapandiyan1s-projects.vercel.app/'+dashboard}>
            
              Dashboard
          
          </Link>
      }
          
          <Link className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                navact.active === 'Register' ? 'bg-white text-gray-800' : 'bg-gray-800 text-gray-300'
              }`}
              
             href="/Register">
            
              Register
            
          </Link>
          <Link 
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${
                navact.active === 'Login' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300'
              }`}
               href="/Login" >
              Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
