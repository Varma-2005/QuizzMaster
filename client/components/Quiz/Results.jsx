import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaClock, FaBrain } from 'react-icons/fa';
import { MdRefresh, MdHome } from 'react-icons/md';
import Button from '../common/Button';

function Results({ result, onRetake, showDetailedResults = true }) {
  const { percentage, score, totalQuestions, timeSpent, feedback, questionResults = [], _id } = result || {};

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <FaTrophy className="mx-auto text-5xl text-yellow-500 mb-4" />
        <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
          {percentage}%
        </div>
        <div className="text-lg text-gray-600 mb-3">
          {score} out of {totalQuestions} correct
        </div>
        <div
          className={`inline-block px-4 py-2 rounded-full text-white font-medium ${
            percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
        >
          {getGradeLabel(percentage)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FaClock className="mx-auto text-2xl text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Time Taken</p>
          <p className="text-lg font-semibold text-blue-600">{formatTime(timeSpent)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FaCheckCircle className="mx-auto text-2xl text-green-600 mb-2" />
          <p className="text-sm text-gray-600">Correct</p>
          <p className="text-lg font-semibold text-green-600">{score}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <FaTimesCircle className="mx-auto text-2xl text-red-600 mb-2" />
          <p className="text-sm text-gray-600">Incorrect</p>
          <p className="text-lg font-semibold text-red-600">{totalQuestions - score}</p>
        </div>
      </div>

      {/* AI Feedback */}
      {feedback && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <FaBrain className="mr-2 text-purple-600" />
            AI Feedback
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-purple-800">{feedback}</p>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {showDetailedResults && questionResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Question Review</h3>
          <div className="space-y-4">
            {questionResults.slice(0, 5).map((q, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-800 flex-1 mr-4">
                    {i + 1}. {q.question}
                  </p>
                  {q.isCorrect ? (
                    <FaCheckCircle className="text-green-500 mt-1" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mt-1" />
                  )}
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Your Answer:</span>{' '}
                    <span className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {q.userAnswer || 'Not answered'}
                    </span>
                  </div>
                  {!q.isCorrect && (
                    <div>
                      <span className="font-medium">Correct Answer:</span>{' '}
                      <span className="text-green-600">{q.correctAnswer}</span>
                    </div>
                  )}
                </div>

                {q.explanation && (
                  <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-800">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}

            {questionResults.length > 5 && (
              <div className="text-center pt-4">
                <Link
                  to={`/results/${_id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {questionResults.length} questions
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/dashboard">
            <Button className="flex items-center space-x-2">
              <MdHome />
              <span>Dashboard</span>
            </Button>
          </Link>

          {onRetake && (
            <Button onClick={onRetake} variant="secondary" className="flex items-center space-x-2">
              <MdRefresh />
              <span>Retake Quiz</span>
            </Button>
          )}

          <Link to="/quiz-selection">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>New Quiz</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Results;
