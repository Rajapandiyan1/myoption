'use client';

import { setAthen } from '@/Store/Athen';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Qstart component with sequential Q&A logic
function Qstart({ setqstart, id }) {
  const [item, setItem] = useState([]); // Holds all Q&A items
  const [topicsName, setTopicsName] = useState(''); // Holds the topic name
  const [loading, setLoading] = useState(false); // Loading state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the index of the current question
  const [currentQuestion, setCurrentQuestion] = useState(null); // Track the current question
  const [currentAnswer, setCurrentAnswer] = useState(null); // Track the current answer
  const [showAnswer, setShowAnswer] = useState(false); // Track if the answer should be shown
  const [finished, setFinished] = useState(false); // Track if all questions have been viewed
  const [noQuestionsAvailable, setNoQuestionsAvailable] = useState(false); // Track if there are no questions
  const dispatches = useDispatch();

  useEffect(() => {
    // Fetch the Q&A data dynamically from API
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
        if (data.authen !== undefined) return dispatches(setAthen({ Athen: false }));
        setTopicsName(data.data.topics);
        setItem(data.data.QandA); // Assume QandA has question-answer array structure

        if (data.data.QandA && Array.isArray(data.data.QandA) && data.data.QandA.length > 0) {
          // Load the first question if available
          setCurrentQuestion(data.data.QandA[0].question);
          setCurrentAnswer(data.data.QandA[0].answer);
        } else {
          // No questions available
          setNoQuestionsAvailable(true);
        }
      })
      .catch(() => {
        setNoQuestionsAvailable(true); // Error fetching data, consider no questions available
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < item.length - 1) {
      const nextIndex = currentQuestionIndex + 1; // Increment the question index
      setCurrentQuestion(item[nextIndex].question); // Update the current question
      setCurrentAnswer(item[nextIndex].answer); // Update the current answer
      setShowAnswer(false); // Reset answer visibility
      setCurrentQuestionIndex(nextIndex); // Update the index
    } else {
      setFinished(true); // No more questions
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light p-4">
      <h1 className="h2 mb-4">Topic: {topicsName}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-100 max-w-xl bg-white rounded-lg shadow p-4">
          {noQuestionsAvailable ? (
            // Case when no questions are available
            <>
              <p className="h5 mb-4 text-muted">No questions available.</p>
              <p>Go to Edit Option After Add Q&A</p>
            </>
          ) : finished ? (
            <p className="h5 mb-4 text-muted">You have finished all the questions!</p>
          ) : (
            <div>
              {currentQuestion ? (
                <div className="mb-4 p-3 border border-secondary rounded">
                  <h2 className="h5 mb-2">Q: {currentQuestion}</h2>
                  {showAnswer && <p className="text-muted mt-2">A: {currentAnswer}</p>}
                </div>
              ) : (
                <p>No questions available.</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 d-flex justify-content-between">
        {/* Show the Go Back button when finished or no questions are available */}
        {finished || noQuestionsAvailable ? (
          <button
            className="btn btn-primary"
            onClick={() => setqstart(false)} // Go back
          >
            Go Back
          </button>
        ) : (
          <>
            {/* Show Answer Button */}
            {!showAnswer && (
              <button
                className="btn btn-success"
                onClick={() => setShowAnswer(true)}
              >
                Show Answer
              </button>
            )}

            {/* Next Question Button */}
            {showAnswer && (
              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
              >
                Next Question
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Qstart;
