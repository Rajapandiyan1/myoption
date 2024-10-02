import { setAthen } from '@/Store/Athen';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const FAQInput = () => {
    const [topicName, setTopicName] = useState('');  // Single topic
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);  // List of Q&As
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [topicError, setTopicError] = useState('');
    const [questionError, setQuestionError] = useState('');
    const [answerError, setAnswerError] = useState('');
    const dispatches =useDispatch();

    const param = useParams();

    const validateInputs = () => {
        let isValid = true;
        setTopicError('');
        setQuestionError('');
        setAnswerError('');

        if (!topicName) {
            setTopicError('Topic name is required.');
            isValid = false;
        } else if (topicName.length > 15) {  // Check for maximum length of 15 characters
            setTopicError('Topic name must be 15 characters or less.');
            isValid = false;
        }
        if (!question) {
            setQuestionError('Question is required.');
            isValid = false;
        }
        if (!answer) {
            setAnswerError('Answer is required.');
            isValid = false;
        }

        return isValid;
    };

    const handleAddQA = () => {
        if (!validateInputs()) return;

        setQuestionsAndAnswers((prevQAs) => {
            const newQAs = [...prevQAs];

            // If we're editing an existing Q&A
            if (editIndex !== null) {
                newQAs[editIndex] = { question, answer };
                setToastMessage('Question and Answer updated successfully!');
                setToastType('success');
                setEditIndex(null);
            } else {
                // Add a new Q&A
                newQAs.push({ question, answer });
                setToastMessage('Question and Answer added successfully!');
                setToastType('success');
            }

            return newQAs;
        });

        setQuestion(''); // Clear input after adding/updating
        setAnswer('');   // Clear input after adding/updating
    };
// verified to athu
    const handleSubmitTopic = async (e) => {
        e.preventDefault();

        const data = {
            topics: topicName,  // Single topic
            QandA: questionsAndAnswers,  // List of Q&A
        };

        try {
            const response = await fetch(`https://server-1-nu7h.onrender.com/createTopics/${param.slug[1]}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(res => res.json());
            if(response.authen!=undefined) return dispatches(setAthen({Athen:false}));
            if (!response.ok) throw response;


            setToastType('success');
            setToastMessage(response.message);

            setTopicName('');
            setQuestionsAndAnswers([]);
        } catch (error) {
            console.error('Error submitting topic:', error);
            setToastMessage('Error submitting topic.');
            setToastType('error');
        }
    };

    const handleEditQA = (index) => {
        const qa = questionsAndAnswers[index];
        setQuestion(qa.question);
        setAnswer(qa.answer);
        setEditIndex(index);
    };

    const openModal = (index) => {
        setDeleteIndex(index);
        setIsModalOpen(true);
    };

    const handleDeleteQA = () => {
        setQuestionsAndAnswers((prevQAs) => {
            const newQAs = [...prevQAs];
            newQAs.splice(deleteIndex, 1);
            return newQAs;
        });
        setIsModalOpen(false);
        setToastMessage('Question and Answer deleted successfully!');
        setToastType('success');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCancelEdit = () => {
        setQuestion(''); // Clear current question
        setAnswer(''); // Clear current answer
        setEditIndex(null); // Reset edit index
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
        <div className="max-w-7xl mx-auto px-1 sm:px-3 py-5 flex flex-col relative">
            <h1 className="text-3xl font-bold mt-5">Add Topics</h1>

            {/* Fixed Topic Name Display */}
            <div className="fixed top-0 left-0 right-0 bg-white p-4 shadow-lg">
                <h2 className="text-xl font-semibold">Topic: {topicName || 'Untitled'}</h2>
            </div>

{toastMessage && (
    <div
        className={` fixed top-20 left-1/2 transform -translate-x-1/2 
                    p-3  rounded-md shadow-lg transition-opacity duration-300
                    ${toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                    animate-fadeIn 
                    w-full sm:w-96 lg:w-1/3 max-w-xs`}
        style={{ zIndex: 1000 }}  // Ensure toast is above other elements
    >
        {toastMessage}
    </div>
)}


            {/* Form */}
            <form onSubmit={handleSubmitTopic} className="flex flex-col mb-6 flex-grow overflow-hidden ">
                <input
                    type="text"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="Topic Name"
                    className={`border border-gray-300 rounded-md p-2 w-full mb-1 ${topicError ? 'border-red-500' : ''}`}
                    required
                />
                {topicError && <p className="text-red-500 text-sm mb-2">{topicError}</p>}

                <div className="flex flex-col flex-grow overflow-y-auto">
    <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
        className={`border border-gray-300 rounded-md p-2 w-full mb-1 ${questionError ? 'border-red-500' : ''}`}
        required
    />
    {questionError && <p className="text-red-500 text-sm mb-2">{questionError}</p>}

    <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer"
        className={`border border-gray-300 rounded-md p-2 w-full mb-1 ${answerError ? 'border-red-500' : ''}`}
        required
    />
    {answerError && <p className="text-red-500 text-sm mb-2">{answerError}</p>}
</div>

                <div className="flex justify-between mr-1 mt-2">
                    <button
                        onClick={handleAddQA}
                        type="button"
                        className="bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 transition duration-200 mb-4"
                    >
                        {editIndex !== null ? 'Update Q & A' : 'Add Q & A'}
                    </button>
                    {editIndex !== null && (
                        <button
                            onClick={handleCancelEdit}
                            type="button"
                            className="bg-gray-400 text-white py-2 px-2 rounded-md hover:bg-gray-500 transition duration-200 mb-4 "
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Q&A List */}
            {questionsAndAnswers.length !== 0 && (
                <div className="mt-6 overflow-y-auto flex-grow relative mb-5" style={{ height: '300px' }}>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">{topicName}</h3>
                    {questionsAndAnswers.map((qa, index) => (
                        <div key={index} className="border-b border-gray-300 mb-3 pb-2">
                            <p className="text-green-600">Question {index + 1}:</p>
                            <p className="font-medium py-1 break-words">{qa.question}</p>
                            <p className="text-blue-600">Answer:</p>
                            <p className="text-gray-600 break-words">{qa.answer}</p>
                            <div className="flex justify-end space-x-2 mt-2 px-2">
                                <button
                                    onClick={() => handleEditQA(index)}
                                    className="bg-yellow-500 text-white py-1 px-5 rounded-md hover:bg-yellow-600 transition duration-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openModal(index)}
                                    className="bg-red-500 text-white py-1 px-5 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {questionsAndAnswers.length === 0 && <div className='text-center'>Invalid Q&A </div>}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed z-20 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-md shadow-lg p-6 w-full sm:w-2/3 lg:w-1/3 mx-4">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this question and answer?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteQA}
                                className="bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700 transition duration-200 mr-3"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                    onClick={handleSubmitTopic}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                >
                    Submit Topic
                </button>
            </div>
        </div>
    );
};

export default FAQInput;
