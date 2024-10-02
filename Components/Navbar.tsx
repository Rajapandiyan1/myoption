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
  return ( <nav className="bg-dark position-sticky top-0" style={{zIndex:'1020'}}>
    <div className="container px-2 px-sm-3 px-lg-4">
      <div className="d-flex justify-content-between align-items-center" style={{height:'64px'}}>
        <div className="flex-shrink-0 text-white">MYOPTION</div>
        <div className="d-none d-sm-flex ms-sm-4 gap-3">
         
        
          <Link href="/" className={`text-secondary hover:bg-dark hover:text-white px-3 py-2 rounded fw-medium ${navact.active === 'Home' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`}>
            Home
          </Link>

          {authens.Athen && (
            <Link
              className={`text-secondary hover:bg-dark hover:text-white px-3 py-2 rounded fw-medium ${navact.active === 'Dashboard' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`}
              href={`https://myoption-u4kk-git-master-rajapandiyan1s-projects.vercel.app/${dashboard}`}>
              Dashboard
            </Link>
          )}

          <Link className={`text-secondary hover:bg-dark hover:text-white px-3 py-2 rounded fw-medium ${navact.active === 'Register' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`} href="/Register">
            Register
          </Link>

          <Link className={`text-secondary hover:bg-dark hover:text-white px-3 py-2 rounded fw-medium ${navact.active === 'Login' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`} href="/Login">
            Login
          </Link>
        </div>

        <div className="me-n2 d-flex d-sm-none">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-secondary d-inline-flex align-items-center justify-content-center p-2 rounded custom-hover"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg className="d-block" style={{height:'1rem',width:'1rem'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="d-block" style={{height:'1rem',width:'1rem'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>

    <div className={`${isOpen ? 'd-block' : 'd-none'} d-sm-none`} id="mobile-menu">
      <div className="px-2 pt-2 pb-3">
        <Link className={`text-secondary d-block px-3 py-2 rounded fw-medium custom-hover
  ${navact.active === 'Home' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`} href="/">
          Home
        </Link>

        {authens.Athen && (
          <Link
            className={`text-secondary d-block px-3 py-2 rounded fw-medium custom-hover
              ${navact.active === 'Dashboard' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`}
            href={`https://myoption-u4kk-git-master-rajapandiyan1s-projects.vercel.app/${dashboard}`}>
            Dashboard
          </Link>
        )}

        <Link className={`text-secondary d-block px-3 py-2 rounded fw-medium custom-hover
  ${navact.active === 'Register' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`} href="/Register">
          Register
        </Link>

        <Link className={`text-secondary d-block px-3 py-2 rounded fw-medium custom-hover
  ${navact.active === 'Login' ? 'bg-white text-dark' : 'bg-dark text-secondary'}`} href="/Login">
          Login
        </Link>
      </div>
    </div>
  </nav> 
  );
};

export default Navbar;
