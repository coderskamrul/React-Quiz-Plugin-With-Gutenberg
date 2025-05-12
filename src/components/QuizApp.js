import { useEffect, useState } from "react"
import { __ } from "@wordpress/i18n"
import { useQuiz } from "../contexts/QuizContext"
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
  const [submitError, setSubmitError] = useState(null)
  const [submitResult, setSubmitResult] = useState(null)

  useEffect(() => {
    // Fetch quiz data when component mounts
    fetchQuiz(quizId)
  }, [quizId])


  const handleReset = () => {
    resetQuiz()
    setQuizSubmitted(false)
    setCurrentQuestionIndex(0)
    setSubmitResult(null)
    setSubmitError(null)
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

}

export default QuizApp
