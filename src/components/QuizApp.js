import { useEffect, useState } from "react"
import { __ } from "@wordpress/i18n"
import { useQuiz } from "../contexts/QuizContext"
import QuizQuestion from "./QuizQuestion"
import QuizResult from "./QuizResult"

const QuizApp = ({ quizId }) => {
  const {
    currentQuiz,
    questions,
    userAnswers,
    score,
    loading,
    error,
    fetchQuiz,
    calculateScore,
    submitQuiz,
    resetQuiz,
  } = useQuiz()

  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitResult, setSubmitResult] = useState(null)

  useEffect(() => {
    // Fetch quiz data when component mounts
    fetchQuiz(quizId)
  }, [quizId])

  const handleSubmit = async () => {
    try {
      setSubmitError(null)
      const result = await submitQuiz(quizId)
      setSubmitResult(result)
      setQuizSubmitted(true)
    } catch (error) {
      console.error("Error submitting quiz:", error)
      setSubmitError(error.message || "Failed to submit quiz. Please try again.")
    }
  }

  const handleReset = () => {
    resetQuiz()
    setQuizSubmitted(false)
    setCurrentQuestionIndex(0)
    setSubmitResult(null)
    setSubmitError(null)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const toggleViewMode = () => {
    setShowAllQuestions(!showAllQuestions)
  }

  if (loading) {
    return <div className="quiz-loading">{__("Loading quiz...", "react-quiz-app")}</div>
  }

  if (error) {
    return (
      <div className="quiz-error">
        {__("Error:", "react-quiz-app")} {error}
      </div>
    )
  }

  if (!currentQuiz) {
    return <div className="quiz-error">{__("Quiz not found", "react-quiz-app")}</div>
  }

  if (quizSubmitted) {
    return (
      <QuizResult
        score={score}
        questions={questions}
        userAnswers={userAnswers}
        onReset={handleReset}
        submitResult={submitResult}
      />
    )
  }

  const isQuizComplete = Object.keys(userAnswers).length === questions.length

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{currentQuiz.title}</h2>

      <div className="quiz-controls">
        <button type="button" className="quiz-view-toggle" onClick={toggleViewMode}>
          {showAllQuestions
            ? __("Show One Question at a Time", "react-quiz-app")
            : __("Show All Questions", "react-quiz-app")}
        </button>
      </div>

      {showAllQuestions ? (
        <div className="quiz-questions-all">
          {questions.map((question, index) => (
            <QuizQuestion key={index} question={question} questionIndex={index} userAnswer={userAnswers[index]} />
          ))}
        </div>
      ) : (
        <div className="quiz-questions-single">
          {questions.length > 0 && (
            <QuizQuestion
              question={questions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
          )}

          <div className="quiz-navigation">
            <button
              type="button"
              className="quiz-nav-button"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              {__("Previous", "react-quiz-app")}
            </button>

            <span className="quiz-progress">
              {__("Question", "react-quiz-app")} {currentQuestionIndex + 1} {__("of", "react-quiz-app")}{" "}
              {questions.length}
            </span>

            <button
              type="button"
              className="quiz-nav-button"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              {__("Next", "react-quiz-app")}
            </button>
          </div>
        </div>
      )}

      <div className="quiz-submit">
        {submitError && <div className="quiz-submit-error">{submitError}</div>}

        <button type="button" className="quiz-submit-button" onClick={handleSubmit} disabled={!isQuizComplete}>
          {__("Submit Quiz", "react-quiz-app")}
        </button>

        {!isQuizComplete && (
          <p className="quiz-incomplete-message">
            {__("Please answer all questions before submitting.", "react-quiz-app")}
          </p>
        )}
      </div>
    </div>
  )
}

export default QuizApp
