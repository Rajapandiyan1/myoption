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
    const [dele,setdele]=useState(false);

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
        setdele(true)
        try {
            const response = await fetch(`https://server-1-nu7h.onrender.com/deleteTopics/${topicToDelete}`, {
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
            setdele(false)
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
                    style={{ zIndex: 100 }}
                >
                    {toastMessage}
                </div>
            )}

            {/* Modal for delete confirmation */}
            {isModalOpen && (
  <div className="modal fade show d-flex justify-content-center align-items-center">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-lg shadow-lg">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
          <button
            type="button"
            className="close"
            onClick={closeModal}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete{' '}
            <span className="text-primary font-weight-bold">{deletetopic}</span>{' '}
            topic?
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" disabled={dele} className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" disabled={dele} className="btn btn-danger" onClick={deleteTopics}>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}


            {edit && 
            
            <>
            <button  onClick={()=>{setedit(false)}} className=" hover:text-blue-400 mt-1 ms-1 space-x-2 text-gray-700 btn btn-sm btn-secondary hover:text-gray-900">
  
  <span> {"Back"} </span>
</button>
<EditTopics editId={editId}/>
            </>}
        </>
    );
}

export default Option;
