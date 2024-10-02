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
            if (response.authen !== undefined) return dispatches(setAthen({ Athen: false }));
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
        <div className="container my-5">
            <h1 className="text-center mb-4">Add Topics</h1>

            {/* Fixed Topic Name Display */}
            <div className="bg-light p-3 mb-4">
                <h2 className="h5">Topic: {topicName || 'Untitled'}</h2>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-danger'} fixed-top m-2`} role="alert">
                    {toastMessage}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitTopic} className="mb-4">
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

                <div className="mb-3">
                    <textarea
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
                        required
                    />
                    {answerError && <div className="invalid-feedback">{answerError}</div>}
                </div>

                <div className="d-flex justify-content-between">
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
                <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                    <h3 className="h5">Q&A List</h3>
                    {questionsAndAnswers.map((qa, index) => (
                        <div key={index} className="border p-3 mb-3">
                            <p className="font-weight-bold">Question {index + 1}:</p>
                            <p className="text-muted">{qa.question}</p>
                            <p className="font-weight-bold">Answer:</p>
                            <p className="text-muted">{qa.answer}</p>
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() => handleEditQA(index)}
                                    className="btn btn-warning mr-2"
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
            {questionsAndAnswers.length === 0 && <div className='text-center text-danger'>Invalid Q&A</div>}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this question and answer?</p>
                            </div>
                            <div className="modal-footer">
                                <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                <button onClick={handleDeleteQA} className="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="fixed-bottom text-center mb-4">
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
