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
  const dispatches =useDispatch();

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
        if(data.authen!=undefined) return dispatches(setAthen({Athen:false}));
        if(!data.ok) throw data
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
        if(data.authen!=undefined) return dispatches(setAthen({Athen:false}));
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
        if(data.authen!=undefined) return dispatches(setAthen({Athen:false}));
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
        if(data.authen!=undefined) return dispatches(setAthen({Athen:false}));
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
    <div>
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-5 px-4 py-2 rounded-md shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toastMessage}
        </div>
      )}

      {!loading && (
        <h1 className='bg-gray-200 px-4 py-2 mt-5'>
          Topics: <span className='font-semibold text-blue-800 uppercase'>{topicsName}</span>
        </h1>
      )}
      {!loading && (
        <div className='mt-6'>
          <h3 className='text-xl font-semibold mb-2'>Add New Question and Answer</h3>
          <form onSubmit={addQandA} className='space-y-4'>
            <div>
              <label className='block text-gray-700'>Question:</label>
              <input
                type='text'
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`w-full px-4 py-2 border ${questionError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder='Enter the question'
              />
              {questionError && <p className='text-red-500 text-sm'>{questionError}</p>}
            </div>
            <div>
              <label className='block text-gray-700'>Answer:</label>
              <input
                type='text'
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className={`w-full px-4 py-2 border ${answerError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder='Enter the answer'
              />
              {answerError && <p className='text-red-500 text-sm'>{answerError}</p>}
            </div>
            <div className='flex justify-end'>
              <button
                type='submit'
                className='px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none'
              >
                Add Question and Answer
              </button>
            </div>
          </form>
        </div>
      )}

      {item.length === 0 && !loading && (
        <div className='flex items-center justify-center mt-10'>
          <h1>Invalid Question and Answer</h1>
        </div>
      )}
      {loading && (
        <div style={{ minHeight: '90vh' }} className='flex items-center justify-center bg-gray-100'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-blue-500 border-opacity-50'></div>
        </div>
      )}

      {!loading && item.length !== 0 && (
        <>
          <div className='max-w-2xl p-6'>
            <h1>Edit Topics</h1>
            <h6 className='text-2xl font-semibold mb-4'>Questions and Answers</h6>

            <ul className=''>
              {item.map((item, index) => (
                <li key={index} className='py-4 flex flex-col space-y-2'>
                  <div>
                    <p className='text-gray-600'>Question: {index + 1}</p>
                    <h2 className='text-lg font-semibold text-gray-900'>{item.question} ?</h2>
                    <p className='text-gray-600'>Answer <span className='font-bold text-gray-900'>:</span> </p>
                    <p className='text-gray-600'>{item.answer}</p>
                  </div>
                  <div className='space-x-2'>
                    <button
                      className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none'
                      onClick={() => openEditModal(index)}
                    >
                      Edit
                    </button>
                    <button
                      className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none'
                      onClick={() => deleteQandA(index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {isEditing && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2'>
          <div className='bg-white rounded-lg p-6 shadow-lg w-96'>
            <h3 className='text-xl font-semibold mb-4'>Edit Question and Answer</h3>
            <form className='space-y-4'>
              <div>
                <label className='block text-gray-700'>Question:</label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className={`w-full px-4 py-2 border ${questionError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder='Enter the question'
                  rows={3}
                />
                {questionError && <p className='text-red-500 text-sm'>{questionError}</p>}
              </div>
              <div>
                <label className='block text-gray-700'>Answer:</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className={`w-full px-4 py-2 border ${answerError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder='Enter the answer'
                  rows={4}
                />
                {answerError && <p className='text-red-500 text-sm'>{answerError}</p>}
              </div>
              <div className='flex justify-end'>
                <button onClick={(e) => { updateQandA(e) }}
                  type='submit'
                  className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none'
                >
                  Update
                </button>
                <button
                  type='button'
                  className='px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none ml-2'
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmingDelete && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2'>
          <div className='bg-white rounded-lg p-6 shadow-lg w-96'>
            <h3 className='text-xl font-semibold mb-4'>Confirm Deletion</h3>
            <p className='mb-4'>Are you sure you want to delete this question and answer?</p>
            <div className='flex justify-end'>
              <button
                onClick={confirmDeleteQandA}
                className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none'
              >
                Delete
              </button>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className='px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none ml-2'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditTopics;
