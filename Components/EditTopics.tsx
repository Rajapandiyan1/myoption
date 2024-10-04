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
  const [qloading,setqloading]=useState(false)
  const [dele,setdele]=useState(false);
  const [upd,setupd]=useState(false)

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
    setdele(true)
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
      setdele(false)
    }
  };

  const addQandA = async (e) => {
    setqloading(true)
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
    }finally{
      setqloading(false)
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
    setupd(true)
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
    }finally{
      setupd(false)
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
    <div className="container mt-4">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-5 px-4 py-2 rounded-md shadow-lg ${toastType === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
          {toastMessage}
        </div>
      )}

      {!loading && (
        <h1 className='bg-light p-2 mt-3'>
          Topics: <span className='font-weight-bold text-primary'>{topicsName}</span>
        </h1>
      )}

      {!loading && (
        <div className='mt-4'>
          <h3 className='h5 font-weight-bold mb-2'>Add New Question and Answer</h3>
          <form onSubmit={addQandA} className='mb-4'>
            <div className='form-group'>
              <label>Question:</label>
              <input
                type='text'
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`form-control mt-2 ${questionError ? 'is-invalid' : ''}`}
                placeholder='Enter the question'
              />
              {questionError && <div className='invalid-feedback'>{questionError}</div>}
            </div>
            <div className='form-group'>
              <label className='mt-2'>Answer:</label>
              <input
                type='text'
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className={`form-control mt-2 ${answerError ? 'is-invalid' : ''}`}
                placeholder='Enter the answer'
              />
              {answerError && <div className='invalid-feedback'>{answerError}</div>}
            </div>
            <button type='submit' disabled={qloading} className='btn btn-primary mt-3'>
              Add Question and Answer
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        item.map((qAndA, index) => (
          <div key={index} className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom py-3">
  <div className='col-md-9'>
    <p className="text-black mb-1">Q {index + 1}.</p>
    <p className="font-weight-bold">{qAndA.question}</p>
    <p className="text-black mb-1">Ans:</p>
    <p>{qAndA.answer}</p>
  </div>
  <div className="mt-3  mt-md-0 d-flex justify-content-end  flex-md-row">
    <button
      onClick={() => openEditModal(index)}
      className="btn btn-primary text-white "
    >
      Edit
    </button>
    <button
      onClick={() => deleteQandA(index)}
      className="btn btn-danger text-white ms-3"
    >
      Delete
    </button>
  </div>
</div>

        ))
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className='modal fade show' tabIndex={-1} style={{ display: 'block' }} aria-modal='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Confirm Deletion</h5>
                <button type='button' className='close' onClick={() => setIsConfirmingDelete(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p>Are you sure you want to delete this question and answer?</p>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' onClick={() => setIsConfirmingDelete(false)}>
                  Cancel
                </button>
                <button type='button' disabled={dele} className='btn btn-danger' onClick={confirmDeleteQandA}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className='modal fade show' tabIndex={-1} style={{ display: 'block' }} aria-modal='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Edit Question and Answer</h5>
                <button type='button' className='close' onClick={closeEditModal}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={updateQandA} className='modal-body'>
                <div className='form-group'>
                  <label>Question:</label>
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
                  <label>Answer:</label>
                  <input
                    type='text'
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className={`form-control ${answerError ? 'is-invalid' : ''}`}
                    placeholder='Enter the answer'
                  />
                  {answerError && <div className='invalid-feedback'>{answerError}</div>}
                </div>
              </form>
              <div className='modal-footer'>
                <button type='button' disabled={upd} className='btn btn-secondary' onClick={closeEditModal}>
                  Cancel
                </button>
                <button type='submit' disabled={upd} className='btn btn-primary' onClick={updateQandA}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditTopics;
