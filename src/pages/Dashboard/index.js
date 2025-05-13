import { useEffect, useState } from "react"
import { __ } from "@wordpress/i18n"
import { useQuiz } from "../../contexts/QuizContext"
import QuizEditor from "../../components/QuizEditor"

const Dashboard = () => {
  const { quizzes, fetchQuizzes, fetchQuiz, currentQuiz } = useQuiz()
  const [selectedQuizId, setSelectedQuizId] = useState(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId)
    fetchQuiz(quizId)
  }

  return (
    <div className="dashboard-container">
      <h1>{__("Quiz Dashboard", "react-quiz-app")}</h1>

      <div className="dashboard-content">
        <div className="quiz-list-container">
          <h2>{__("Your Quizzes", "react-quiz-app")}</h2>

          {quizzes.length === 0 ? (
            <p>{__("No quizzes found. Create a new quiz to get started.", "react-quiz-app")}</p>
          ) : (
            <ul className="quiz-list">
              {quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className={`quiz-list-item ${selectedQuizId === quiz.id ? "selected" : ""}`}
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  {quiz.title}
                </li>
              ))}
            </ul>
          )}

          <div className="quiz-actions">
            <a href="/wp-admin/post-new.php?post_type=quiz" className="button">
              {__("Create New Quiz", "react-quiz-app")}
            </a>
          </div>
        </div>

        <div className="quiz-editor-container">
          {currentQuiz ? (
            <QuizEditor quiz={currentQuiz} />
          ) : (
            <div className="no-quiz-selected">
              <p>{__("Select a quiz from the list to edit its questions.", "react-quiz-app")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
