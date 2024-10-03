'use client';

import { setAthen } from '@/Store/Athen';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Qstart component with sequential Q&A logic
function Qstart({setActiveTab, setqstart, id }) {
  const [item, setItem] = useState([]); // Holds all Q&A items
  const [topicsName, setTopicsName] = useState(''); // Holds the topic name
  const [loading, setLoading] = useState(false); // Loading state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the index of the current question
  const [showAnswer, setShowAnswer] = useState(false); // Track if the answer should be shown
  const [finished, setFinished] = useState(false); // Track if all questions have been viewed
  const [noQuestionsAvailable, setNoQuestionsAvailable] = useState(false); // Track if there are no questions
  const dispatches = useDispatch();

  useEffect(() => {
    // Fetch the Q&A data dynamically from the API
    setLoading(true);
    fetch(`https://server-1-nu7h.onrender.com/topics/QandA/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authen !== undefined) {
          dispatches(setAthen({ Athen: false }));
          return;
        }
        setTopicsName(data.data.topics);
        const QandA = data.data.QandA || [];

        // Check if questions are available
        if (QandA.length > 0) {
          setItem(QandA);
        } else {
          setNoQuestionsAvailable(true); // No questions found
        }
      })
      .catch(() => {
        setNoQuestionsAvailable(true); // Error fetching data, treat as no questions available
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, dispatches]);

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < item.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
      setShowAnswer(false); // Hide the answer for the next question
    } else {
      setFinished(true); // No more questions
    }
  };

  // Fetch the current question and answer
  const currentQuestion = item[currentQuestionIndex]?.question;
  const currentAnswer = item[currentQuestionIndex]?.answer;

  return (
    <>
      <button onClick={()=>{setActiveTab(false)}} className='btn btn-sm btn-secondary'>Back</button>

    <div style={{minHeight:'70vh'}} className="d-flex flex-column justify-center items-center bg-gray-100  p-4">

      <h1 className="text-3xl font-bold mb-5">Topic: {topicsName}</h1>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
          {noQuestionsAvailable ? (
            // Case when no questions are available
            <>
              <p className="text-lg font-semibold mb-4 text-gray-600">No questions available.</p>
              <p>Please add Q&A in the edit section.</p>
            </>
          ) : finished ? (
            // Case when all questions are completed
            <p className="text-lg font-semibold mb-4 text-gray-600">You have completed all the questions!</p>
          ) : (
            // Display the current question and answer
            <div>
              {currentQuestion ? (
                <div className="mb-4 p-4 border border-gray-300 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Q: {currentQuestion}</h2>
                  {showAnswer && <p className="text-gray-700 mt-4">A: {currentAnswer}</p>}
                </div>
              ) : (
                <p>No questions available.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex space-x-4 mt-4">
        {/* Show the "Go Back" button when finished or no questions are available */}
        {finished || noQuestionsAvailable ? (
          <button
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
            onClick={() => setqstart(false)}
          >
            Go Back
          </button>
        ) : (
          <>
            {/* Show "Show Answer" button if the answer is not shown */}
            {!showAnswer &&  !loading &&(
              <button
                className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                onClick={() => setShowAnswer(true)}
              >
                Show Answer
              </button>
            )}

            {/* Show "Next Question" button after answer is shown */}
            {showAnswer && (
              <button
                className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
                onClick={handleNextQuestion}
              >
                Next Question
              </button>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default Qstart;
