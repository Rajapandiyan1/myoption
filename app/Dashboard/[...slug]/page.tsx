'use client';
import { useEffect, useState } from 'react';
import Create from '../../../Components/Create'
import Option from '@/Components/Option';
import Edit from '../../../Components/EditOptions'
import { useDispatch, useSelector } from 'react-redux';
import { setNavActive } from '@/Store/NavActive';
import { setAthen } from '@/Store/Athen';
import { useParams} from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
const NavTabs = () => {
    const [activeTab, setActiveTab] = useState('Options');
    const Athens=useSelector((states:any)=>{return states.Authentication.default});
    const DashboardUrl=useSelector((state:any)=>{return state.DashPath.default});
    const params=useParams();
    const [loading,setLoading]=useState(true);
    const [urls,seturls]=useState(false);

const NavActive=useDispatch()
    useEffect(()=>{
        setLoading(true);
        NavActive(setNavActive({active:"Dashboard"}));

axios.get(`https://server-1-nu7h.onrender.com/authperson`,{withCredentials:true}).then((data)=>{
    return data.data;
}).then((data)=>{
                const url=data.dashboardUrl;
                const split=url.split('/');
                split.shift();
                if(params.slug[0]==split[0] && params.slug[1]==split[1] ){
                    seturls(true)
                }
                NavActive(setAthen({Athen:data.authen}))
              }).catch(()=>{
    
              }).finally(()=>{
    setLoading(false);
     })
    },[params.slug[0]])
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Options':
                return <Option setActiveTab={setActiveTab}/>;
            case 'Create Option':
                return <Create />;
            case 'Edit Option':
                return <Edit/>;
            default:
                return <Option setActiveTab={setActiveTab}/>;
        }
    };

    return (
        <>
   {loading && <div style={{minHeight:'90vh'}} className="flex items-center justify-center  bg-gray-100">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-blue-500 border-opacity-50"></div>
</div>}

        {!loading && Athens.Athen && urls   &&<div className="max-w-7xl mx-auto px-2">
            {/* Navigation Tabs */}
            <div className="flex sm:justify-start justify-around  flex-row space-y-2 sm:space-y-0 sm:space-x-4 border-b border-gray-300 pb-3 pt-3">
    {['Options', 'Create Option', 'Edit Option'].map((tab) => (
        <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-2 sm:px-4 text-sm font-medium transition duration-200 
                ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}
                bg-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
    ))}

</div>


        
            <div className="sm:px-3 py-2">
                {renderContent()}
            </div>
        </div>}
        {!Athens.Athen  && !loading && <div style={{minHeight:'90vh'}} className="flex items-center justify-center  bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-lg text-gray-700 px-10">
            You do not have the necessary permissions to view this page. Please {<Link className='text-blue-900 font-bold' href={'/Register'}>Register</Link>} or {<Link className='text-blue-900 font-bold' href={'/Login'}>Login</Link>}  in with an authorized account.
          </p>
        </div>
            </div>}
            {/* licnk problem */}
            {!urls  && Athens.Athen &&  !loading &&
             <div style={{minHeight:'90vh'}} className="flex items-center justify-center  bg-gray-100">

            <div className="text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Sorry, this page isnot available.</h1>
    <p className="text-lg text-gray-600 mb-6">
      The link you followed may be broken, or the page may have been removed.
    </p>
    <Link href={decodeURIComponent('https://myoption-u4kk-git-master-rajapandiyan1s-projects.vercel.app/'+DashboardUrl.path)}  className="text-blue-500 hover:underline">Go back to Dashboard</Link>
  </div>
             </div>
  }
        </>
    );
};

export default NavTabs;
