import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EditTopics from './EditTopics';
import { useDispatch } from 'react-redux';
import { setAthen } from '@/Store/Athen';

function Option() {
    const param = useParams();
    const [topics, setTopics] = useState([]);
    const dispatches=useDispatch();
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [editId,setEditId]=useState('');
    const [toastType, setToastType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
    const [topicToDelete, setTopicToDelete] = useState(null);  // Track which topic to delete
    const [deleteIndex, setDeleteIndex] = useState(null);  // Track the index of the topic to delete
    const [deletetopic,setdeletetopic]=useState('');
    const [edit,setedit]=useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`https://server-1-nu7h.onrender.com/home/topics/${param.slug[1]}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((data) => data.json())
        .then((data) => {
            if(data.authen!=undefined) return dispatches(setAthen({Athen:false}));
            if (!data.ok) throw { message: 'You are an unauthorized person' };
            setTopics(data.datas.topics);
        })
        .catch((e) => {
            e.message;
            setToastMessage('Failed to fetch topics.');
            setToastType('error');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    // Function to delete topics
    async function deleteTopics() {
        try {
            const response = await fetch(`${process.env.PUBLIC_API_URL}/deleteTopics/${topicToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if(data.authen!=undefined) dispatches(setAthen({Athen:true}))
        

            if (data.ok) {
                // Update topics after deletion
                setTopics((prev) => {
                    const newTopics = [...prev];
                    newTopics.splice(deleteIndex, 1);
                    return newTopics;
                });

                setToastMessage('Topic deleted successfully!');
                setToastType('success');
            } else {
                throw new Error(data.message || 'Failed to delete topic');
            }
        } catch (error) {
            setToastMessage(error.message || 'Error deleting the topic');
            setToastType('error');
        } finally {
            setIsModalOpen(false);  // Close the modal after deletion
        }
    }

    // Open modal and set the topic to delete
    const openModal = (id, index,topicName) => {
        setTopicToDelete(id);
        setDeleteIndex(index);
        setIsModalOpen(true);
        setdeletetopic(topicName.topicsName)
    };

    // Close modal without deleting
    const closeModal = () => {
        setIsModalOpen(false);
        setTopicToDelete(null);
        setDeleteIndex(null);
    };

    // Toast message auto-hide effect
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
        <>
            {loading && (
                <div style={{ minHeight: '90vh' }} className="flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-opacity-50">
                    </div>
                </div>
            )}
            {!loading && !edit && topics.length !== 0 && (
                <div className="max-w-4xl mx-auto p-2">
                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Topics</h1>
                    <div className="space-y-2">
                        {topics.map((item, index) => (
                            <>
                            <div key={index} className="bg-white flex justify-between items-center shadow-md rounded-lg p-2 transition transform hover:shadow-lg hover:scale-105 duration-300">
                                
                                <span className="text-lg font-semibold text-blue-600 sm:ms-3 break-words">{item.topicsName}</span>
                                <span className="sm:w-1/4">
                                    <button 
                                        onClick={() => openModal(item.topicsId._id, index,item)}  // Open modal on click
                                        className="me-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm rounded"
                                    >
                                        Delete
                                    </button>
                                    
                                    <button onClick={()=>{setedit(true);
                                     setEditId(item.topicsId._id)}} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 text-sm rounded">
                                        Edit
                                    </button>
                                </span>
                            </div>
                            </>
                        ))}
                    </div>
                </div>
            )}
            {topics.length === 0 && !loading && <div>Invalid data</div>}

            {toastMessage && (
                <div
                    className={`fixed top-20 left-1/2 transform -translate-x-1/2 
                        p-3 rounded-md shadow-lg transition-opacity duration-300
                        ${toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        animate-fadeIn 
                        w-full sm:w-96 lg:w-1/3 max-w-xs`}
                    style={{ zIndex: 1000 }}
                >
                    {toastMessage}
                </div>
            )}

            {/* Modal for delete confirmation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-11/12 sm:w-1/2 lg:w-1/3 p-6">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete <span className='text-blue-900 font-semibold'>{deletetopic}</span> topic?</p>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button 
                                onClick={closeModal} 
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={deleteTopics} 
                                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {edit && 
            
            <>
            <button onClick={()=>{setedit(false)}} className="flex hover:text-blue-400 items-center space-x-2 text-gray-700 hover:text-gray-900">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
  </svg>
  <span>Back</span>
</button>
<EditTopics editId={editId}/>
            </>}
        </>
    );
}

export default Option;
