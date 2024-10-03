import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Qstart from './Qstart';
import { setAthen } from '@/Store/Athen';
import { useDispatch } from 'react-redux';

function Option({setActiveTab}) {
    const param=useParams();
    const [topics,settopics]=useState([]);
    const [loading,setload]=useState(false);
    const [qstart,setqstart]=useState(false);
    const [topicsid,settopicsid]=useState('');
    const dispatches =useDispatch()
    useEffect(()=>{
        setload(true);
        fetch(`https://server-1-nu7h.onrender.com/home/topics/${param.slug[1]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                
            },
        }).then((data)=>{
            return data.json()
        }).then((data)=>{
            if(data.authen!=undefined) return dispatches(setAthen({Athen:false}));
            if(!data.ok) throw {message:'You are Unathuroized person'}
            settopics(data.datas.topics)
        }).catch(()=>{
        }).finally(()=>{
            setload(false)
        })
    },[])
      
    function start() {
    setqstart(false)
    }
    return (
<>
      {}  
        {loading && <div style={{minHeight:'90vh'}} className="flex items-center justify-center  bg-gray-100">
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-blue-500 border-opacity-50"></div>
</div>
}

{qstart && <Qstart setActiveTab={setActiveTab} setqstart={start} id={topicsid}/>}
{!loading && !qstart && topics.length!=0 &&
                <div className="max-w-4xl mx-auto p-2">
            <h1 className="text-2xl font-bold mb-6">All Topics</h1>
            <div className="space-y-2">
                {topics.map((item, index) => (
                    <div key={index} className="bg-white flex justify-between align-center shadow-md rounded-lg p-4 transition transform hover:shadow-lg hover:scale-105 duration-300">
                        <h2 className="text-lg font-semibold text-blue-600 sm:ms-3">{item.topicsName} </h2>
                        <span className='sm:w-1/4'>
                        <button className="sm:me-2 bg-blue-500 hover:bg-blue-700 px-3 text-white font-bold py-1  text-sm rounded" onClick={()=>{setqstart(true);settopicsid(item.topicsId._id)}}>
  Start
</button>
                            </span> 
                        {/* <p className="mt-2 text-gray-700">{item.answer}</p> */}
                    </div>
                ))}
            </div>
        </div>
        }
        {topics.length==0 && !loading && <div>Invalid data</div>}
</>
        
         
        
    );

}

export default Option