import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EditTopics from './EditTopics';
import { useDispatch } from 'react-redux';
import { setAthen } from '@/Store/Athen';

function Option() {
    const param = useParams();
    const [topics, setTopics] = useState([]);
    const dispatches = useDispatch();
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [editId, setEditId] = useState('');
    const [toastType, setToastType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
    const [topicToDelete, setTopicToDelete] = useState(null);  // Track which topic to delete
    const [deleteIndex, setDeleteIndex] = useState(null);  // Track the index of the topic to delete
    const [deletetopic, setdeletetopic] = useState('');
    const [edit, setedit] = useState(false);

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
                if (data.authen !== undefined) return dispatches(setAthen({ Athen: false }));
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

            if (data.authen !== undefined) dispatches(setAthen({ Athen: true }));

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
    const openModal = (id, index, topicName) => {
        setTopicToDelete(id);
        setDeleteIndex(index);
        setIsModalOpen(true);
        setdeletetopic(topicName.topicsName);
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
                <div style={{ minHeight: '90vh' }} className="d-flex align-items-center justify-content-center bg-light">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && !edit && topics.length !== 0 && (
                <div className="container max-w-4xl p-2">
                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Topics</h1>
                    <div className="list-group">
                        {topics.map((item, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span className="font-weight-bold text-primary">{item.topicsName}</span>
                                <span>
                                    <button 
                                        onClick={() => openModal(item.topicsId._id, index, item)}  // Open modal on click
                                        className="btn btn-danger btn-sm me-2"
                                    >
                                        Delete
                                    </button>
                                    
                                    <button onClick={() => { setedit(true); setEditId(item.topicsId._id) }} className="btn btn-warning btn-sm">
                                        Edit
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {topics.length === 0 && !loading && <div>Invalid data</div>}

            {toastMessage && (
                <div
                    className={`position-fixed top-20 start-50 translate-middle p-3 rounded-md shadow-lg transition-opacity duration-300
                        ${toastType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}
                        w-100 sm:w-50 max-w-xs`}
                    style={{ zIndex: 1000 }}
                >
                    {toastMessage}
                </div>
            )}

            {/* Modal for delete confirmation */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete <span className='text-primary font-weight-bold'>{deletetopic}</span> topic?</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    onClick={closeModal} 
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={deleteTopics} 
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {edit && (
                <>
                    <button onClick={() => { setedit(false) }} className="btn btn-link">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <EditTopics editId={editId} />
                </>
            )}
        </>
    );
}

export default Option;
