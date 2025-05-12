import { useState, useEffect } from "react"
import { __ } from "@wordpress/i18n"
import { useQuiz } from "../contexts/QuizContext"

const QuizEditor = ({ quiz }) => {
  const { questions, saveQuiz } = useQuiz()
  const [editedQuestions, setEditedQuestions] = useState(questions)

  // Update local state when questions prop changes
  useEffect(() => {
    setEditedQuestions(questions)
  }, [questions])

  return (
    <div className="quiz-editor">
      <h2>
        {__("Edit Quiz:", "react-quiz-app")} {quiz.title}
      </h2>

    </div>
  )
}

export default QuizEditor
