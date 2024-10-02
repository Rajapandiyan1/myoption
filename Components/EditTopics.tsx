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
  const dispatch = useDispatch();

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Confirmation modal state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchTopicsData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://server-1-nu7h.onrender.com/topics/QandA/${editId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data.authen !== undefined) {
          dispatch(setAthen({ Athen: false }));
        }

        if (!data.ok) throw new Error('Failed to fetch data');

        setTopicName(data.data.topics);
        setItem(data.data.QandA);
      } catch (error) {
        showToastMessage('Failed to load data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTopicsData();
  }, [editId, dispatch]);

  const deleteQandA = (index) => {
    setDeleteIndex(index);
    setIsConfirmingDelete(true);
  };

  const confirmDeleteQandA = async () => {
    if (deleteIndex === null) return;

    try {
      const response = await fetch(`https://server-1-nu7h.onrender.com/removeTopicsQuestion/${editId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index: deleteIndex }),
      });
      const data = await response.json();

      if (data.authen !== undefined) {
        dispatch(setAthen({ Athen: false }));
      }

      if (!data.ok) throw new Error('Failed to delete');

      setItem((prev) => {
        const updated = [...prev];
        updated.splice(deleteIndex, 1);
        return updated;
      });
      showToastMessage('Question and answer deleted successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToastMessage('Failed to delete the question and answer.', 'error');
    } finally {
      setIsConfirmingDelete(false);
      setDeleteIndex(null);
    }
  };

  const addQandA = async (e) => {
    e.preventDefault();
    setQuestionError('');
    setAnswerError('');

    if (!newQuestion) {
      setQuestionError('Please enter a question.');
      return;
    }
    if (!newAnswer) {
      setAnswerError('Please enter an answer.');
      return;
    }

    try {
      const response = await fetch(`https://server-1-nu7h.onrender.com/addNewQuestion/${editId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
      });
      const data = await response.json();

      if (data.authen !== undefined) {
        dispatch(setAthen({ Athen: false }));
      }

      if (!data.ok) throw new Error('Failed to add question and answer');

      setItem((prev) => [...prev, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
      showToastMessage('Question and answer added successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToastMessage('Failed to add the question and answer.', 'error');
    }
  };

  const openEditModal = (index) => {
    const itemToEdit = item[index];
    setNewQuestion(itemToEdit.question);
    setNewAnswer(itemToEdit.answer);
    setEditIndex(index);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setNewQuestion('');
    setNewAnswer('');
    setEditIndex(null);
    setQuestionError('');
    setAnswerError('');
  };

  const updateQandA = async (e) => {
    e.preventDefault();
    setQuestionError('');
    setAnswerError('');

    if (!newQuestion) {
      setQuestionError('Please enter a question.');
      return;
    }
    if (!newAnswer) {
      setAnswerError('Please enter an answer.');
      return;
    }

    try {
      const response = await fetch(`https://server-1-nu7h.onrender.com/replaceTopicsQuestion/${editId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index: editIndex, data: { question: newQuestion, answer: newAnswer } }),
      });
      const data = await response.json();

      if (data.authen !== undefined) {
        dispatch(setAthen({ Athen: false }));
      }

      if (!data.ok) throw new Error('Failed to update');

      setItem((prev) => {
        const updated = [...prev];
        updated[editIndex] = { question: newQuestion, answer: newAnswer };
        return updated;
      });
      closeEditModal();
      showToastMessage('Question and answer updated successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToastMessage('Failed to update the question and answer.', 'error');
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
      setToastType('');
    }, 3000);
  };

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
                className={`w-full px-4 py-2 border ${questionError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                className={`w-full px-4 py-2 border ${answerError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder='Enter the answer'
              />
              {answerError && <p className='text-red-500 text-sm'>{answerError}</p>}
            </div>
            <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'>
              Add Question and Answer
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        item.map((qAndA, index) => (
          <div key={index} className='flex justify-between items-center border-b py-4'>
            <div>
              <p className='font-semibold'>{qAndA.question}</p>
              <p>{qAndA.answer}</p>
            </div>
            <div>
              <button onClick={() => openEditModal(index)} className='text-blue-500 hover:underline mr-4'>
                Edit
              </button>
              <button onClick={() => deleteQandA(index)} className='text-red-500 hover:underline'>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded shadow-lg'>
            <h3 className='text-lg font-semibold'>Are you sure you want to delete this question and answer?</h3>
            <div className='flex justify-end mt-4'>
              <button onClick={() => setIsConfirmingDelete(false)} className='mr-2 text-gray-500'>
                Cancel
              </button>
              <button onClick={confirmDeleteQandA} className='bg-red-600 text-white px-4 py-2 rounded'>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded shadow-lg'>
            <h3 className='text-lg font-semibold'>Edit Question and Answer</h3>
            <form onSubmit={updateQandA} className='space-y-4'>
              <div>
                <label className='block text-gray-700'>Question:</label>
                <input
                  type='text'
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className={`w-full px-4 py-2 border ${questionError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                  className={`w-full px-4 py-2 border ${answerError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder='Enter the answer'
                />
                {answerError && <p className='text-red-500 text-sm'>{answerError}</p>}
              </div>
              <div className='flex justify-end'>
                <button type='button' onClick={closeEditModal} className='mr-2 text-gray-500'>
                  Cancel
                </button>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditTopics;
