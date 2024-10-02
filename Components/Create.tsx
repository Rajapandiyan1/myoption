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
    const dispatches = useDispatch();

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
            if(response.authen !== undefined) return dispatches(setAthen({ Athen: false }));
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
        <div className="container mt-5">
            <h1 className="h3 mb-3">Add Topics</h1>

            {/* Fixed Topic Name Display */}
            <div className="position-fixed top-0 left-0 right-0 bg-white p-4 shadow">
                <h2 className="h5">Topic: {topicName || 'Untitled'}</h2>
            </div>

            {toastMessage && (
                <div
                    className={`position-fixed top-20 start-50 translate-middle p-3 rounded shadow-lg transition-opacity duration-300
                    ${toastType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}
                    style={{ zIndex: 1000 }}  // Ensure toast is above other elements
                >
                    {toastMessage}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitTopic} className="mb-6">
                <div className="mb-3">
                    <input
                        type="text"
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        placeholder="Topic Name"
                        className={`form-control ${topicError ? 'is-invalid' : ''}`}
                        required
                    />
                    {topicError && <div className="invalid-feedback">{topicError}</div>}
                </div>

                <div className="flex flex-col flex-grow overflow-y-auto">
                    <div className="mb-3">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Question"
                            className={`form-control ${questionError ? 'is-invalid' : ''}`}
                            required
                        />
                        {questionError && <div className="invalid-feedback">{questionError}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Answer"
                            className={`form-control ${answerError ? 'is-invalid' : ''}`}
                            rows={3}
                            required
                        />
                        {answerError && <div className="invalid-feedback">{answerError}</div>}
                    </div>
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <button
                        onClick={handleAddQA}
                        type="button"
                        className="btn btn-primary"
                    >
                        {editIndex !== null ? 'Update Q & A' : 'Add Q & A'}
                    </button>
                    {editIndex !== null && (
                        <button
                            onClick={handleCancelEdit}
                            type="button"
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Q&A List */}
            {questionsAndAnswers.length !== 0 && (
                <div className="mt-4 overflow-y-auto" style={{ height: '300px' }}>
                    <h3 className="h5 text-muted mb-2">{topicName}</h3>
                    {questionsAndAnswers.map((qa, index) => (
                        <div key={index} className="border-bottom mb-3 pb-2">
                            <p className="text-success">Question {index + 1}:</p>
                            <p className="font-weight-medium py-1">{qa.question}</p>
                            <p className="text-info">Answer:</p>
                            <p className="text-muted">{qa.answer}</p>
                            <div className="d-flex justify-content-end space-x-2 mt-2">
                                <button
                                    onClick={() => handleEditQA(index)}
                                    className="btn btn-warning me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openModal(index)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {questionsAndAnswers.length === 0 && <div className='text-center'>Invalid Q&A</div>}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="position-fixed top-0 left-0 w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-center align-items-center">
                    <div className="bg-white rounded shadow-lg p-4 w-100 w-sm-50">
                        <h2 className="h5 mb-3">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this question and answer?</p>
                        <div className="d-flex justify-content-end mt-4">
                            <button
                                onClick={closeModal}
                                className="btn btn-secondary me-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteQA}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="position-fixed bottom-4 start-50 translate-middle">
                <button
                    onClick={handleSubmitTopic}
                    className="btn btn-success"
                >
                    Submit Topic
                </button>
            </div>
        </div>
    );
};

export default FAQInput;
