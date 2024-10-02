'use client';
import { setAthen } from '@/Store/Athen';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function EditTopics({ editId }) {
  const [item, setItem] = useState([]);
  const [topicsName, setTopicName] = useState('');
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const dispatches = useDispatch();

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Confirmation modal state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://server-1-nu7h.onrender.com/topics/QandA/${editId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.authen !== undefined) return dispatches(setAthen({ Athen: false }));
        if (!data.ok) throw data;
        setTopicName(data.data.topics);
        setItem(data.data.QandA);
      })
      .catch(() => {
        showToastMessage('Failed to load data.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [editId]);

  function deleteQandA(index) {
    setDeleteIndex(index); // Set the index of the item to delete
    setIsConfirmingDelete(true); // Open the confirmation modal
  }

  function confirmDeleteQandA() {
    if (deleteIndex === null) return;

    fetch(`https://server-1-nu7h.onrender.com/removeTopicsQuestion/${editId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index: deleteIndex }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.authen !== undefined) return dispatches(setAthen({ Athen: false }));
        if (!data.ok) throw data;
        setItem((prev) => {
          const updated = [...prev];
          updated.splice(deleteIndex, 1);
          return updated;
        });
        showToastMessage('Question and answer deleted successfully!', 'success');
        setIsConfirmingDelete(false); // Close the confirmation modal
      })
      .catch((e) => {
        console.error(e);
        showToastMessage('Failed to delete the question and answer.', 'error');
        setIsConfirmingDelete(false); // Close the confirmation modal
      });
  }

  async function addQandA(e) {
    e.preventDefault();
    setQuestionError('');
    setAnswerError('');

    let hasError = false;
    if (!newQuestion) {
      setQuestionError('Please enter a question.');
      hasError = true;
    }
    if (!newAnswer) {
      setAnswerError('Please enter an answer.');
      hasError = true;
    }

    if (hasError) return;

    fetch(`https://server-1-nu7h.onrender.com/addNewQuestion/${editId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.authen !== undefined) return dispatches(setAthen({ Athen: false }));
        if (!data.ok) throw data;
        setItem((prev) => [...prev, { question: newQuestion, answer: newAnswer }]);
        setNewQuestion('');
        setNewAnswer('');
        showToastMessage('Question and answer added successfully!', 'success');
      })
      .catch((e) => {
        console.error(e);
        showToastMessage('Failed to add the question and answer.', 'error');
      });
  }

  function openEditModal(index) {
    const itemToEdit = item[index];
    setNewQuestion(itemToEdit.question);
    setNewAnswer(itemToEdit.answer);
    setEditIndex(index);
    setIsEditing(true);
  }

  function closeEditModal() {
    setIsEditing(false);
    setNewQuestion('');
    setNewAnswer('');
    setEditIndex(null);
    setQuestionError('');
    setAnswerError('');
  }

  function updateQandA(e) {
    e.preventDefault();
    setQuestionError('');
    setAnswerError('');

    let hasError = false;
    if (!newQuestion) {
      setQuestionError('Please enter a question.');
      hasError = true;
    }
    if (!newAnswer) {
      setAnswerError('Please enter an answer.');
      hasError = true;
    }

    if (hasError) return;

    fetch(`https://server-1-nu7h.onrender.com/replaceTopicsQuestion/${editId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index: editIndex, data: { question: newQuestion, answer: newAnswer } }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.authen !== undefined) return dispatches(setAthen({ Athen: false }));
        if (!data.ok) throw data;
        setItem((prev) => {
          const updated = [...prev];
          updated[editIndex] = { question: newQuestion, answer: newAnswer };
          return updated;
        });
        closeEditModal();
        showToastMessage('Question and answer updated successfully!', 'success');
      })
      .catch((e) => {
        console.error(e);
        showToastMessage('Failed to update the question and answer.', 'error');
      });
  }

  function showToastMessage(message, type) {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
      setToastType('');
    }, 3000);
  }

  return (
    <div className="container">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-5 px-4 py-2 rounded-md shadow-lg ${toastType === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
          {toastMessage}
        </div>
      )}

      {!loading && (
        <h1 className='bg-light p-3 mt-5'>
          Topics: <span className='font-weight-bold text-primary'>{topicsName}</span>
        </h1>
      )}
      {!loading && (
        <div className='mt-4'>
          <h3 className='h5 font-weight-bold mb-2'>Add New Question and Answer</h3>
          <form onSubmit={addQandA} className='mb-4'>
            <div className='form-group'>
              <label className='form-label'>Question:</label>
              <input
                type='text'
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`form-control ${questionError ? 'is-invalid' : ''}`}
                placeholder='Enter the question'
              />
              {questionError && <div className='invalid-feedback'>{questionError}</div>}
            </div>
            <div className='form-group'>
              <label className='form-label'>Answer:</label>
              <input
                type='text'
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className={`form-control ${answerError ? 'is-invalid' : ''}`}
                placeholder='Enter the answer'
              />
              {answerError && <div className='invalid-feedback'>{answerError}</div>}
            </div>
            <div className='d-flex justify-content-end'>
              <button
                type='submit'
                className='btn btn-success'
              >
                Add Question and Answer
              </button>
            </div>
          </form>
        </div>
      )}

      {item.length === 0 && !loading && (
        <div className='d-flex justify-content-center mt-5'>
          <h1>Invalid Question and Answer</h1>
        </div>
      )}
      {loading && (
        <div style={{ minHeight: '90vh' }} className='d-flex align-items-center justify-content-center bg-light'>
          <div className='spinner-border text-primary' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )}
      <div className='mt-4'>
        <h3 className='h5 font-weight-bold mb-3'>List of Questions and Answers</h3>
        {item.map((data, index) => (
          <div key={index} className='border rounded mb-2 p-3'>
            <h4 className='h6'>{data.question}</h4>
            <p>{data.answer}</p>
            <div className='d-flex justify-content-end'>
              <button onClick={() => openEditModal(index)} className='btn btn-primary mr-2'>
                Edit
              </button>
              <button onClick={() => deleteQandA(index)} className='btn btn-danger'>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {isConfirmingDelete && (
        <div className='modal show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Confirm Delete</h5>
                <button onClick={() => setIsConfirmingDelete(false)} className='close'>
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p>Are you sure you want to delete this question and answer?</p>
              </div>
              <div className='modal-footer'>
                <button onClick={() => setIsConfirmingDelete(false)} className='btn btn-secondary'>
                  Cancel
                </button>
                <button onClick={confirmDeleteQandA} className='btn btn-danger'>
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className='modal show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Edit Question and Answer</h5>
                <button onClick={closeEditModal} className='close'>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={updateQandA} className='modal-body'>
                <div className='form-group'>
                  <label className='form-label'>Question:</label>
                  <input
                    type='text'
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className={`form-control ${questionError ? 'is-invalid' : ''}`}
                    placeholder='Enter the question'
                  />
                  {questionError && <div className='invalid-feedback'>{questionError}</div>}
                </div>
                <div className='form-group'>
                  <label className='form-label'>Answer:</label>
                  <input
                    type='text'
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className={`form-control ${answerError ? 'is-invalid' : ''}`}
                    placeholder='Enter the answer'
                  />
                  {answerError && <div className='invalid-feedback'>{answerError}</div>}
                </div>
                <div className='modal-footer'>
                  <button type='button' onClick={closeEditModal} className='btn btn-secondary'>
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-success'>
                    Update Question and Answer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditTopics;
