import { useState, useEffect } from "react"
import { __ } from "@wordpress/i18n"
import { useQuiz } from "../contexts/QuizContext"

const QuizEditor = ({ quiz }) => {
  const { questions, saveQuiz } = useQuiz()
  const [editedQuestions, setEditedQuestions] = useState(questions)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Update local state when questions prop changes
  useEffect(() => {
    setEditedQuestions(questions)
  }, [questions])

  const handleAddQuestion = () => {
    setEditedQuestions([
      ...editedQuestions,
      {
        text: "",
        answers: ["", "", "", ""],
        correctAnswer: 0,
      },
    ])
  }

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...editedQuestions]
    newQuestions.splice(index, 1)
    setEditedQuestions(newQuestions)
  }

  const handleQuestionTextChange = (index, text) => {
    const newQuestions = [...editedQuestions]
    newQuestions[index].text = text
    setEditedQuestions(newQuestions)
  }

  const handleAnswerChange = (questionIndex, answerIndex, text) => {
    const newQuestions = [...editedQuestions]
    newQuestions[questionIndex].answers[answerIndex] = text
    setEditedQuestions(newQuestions)
  }

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    const newQuestions = [...editedQuestions]
    newQuestions[questionIndex].correctAnswer = answerIndex
    setEditedQuestions(newQuestions)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage("")

    try {
      await saveQuiz(quiz.id, editedQuestions)
      setSaveMessage(__("Quiz saved successfully!", "react-quiz-app"))
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage(`${__("Error:", "react-quiz-app")} ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="quiz-editor">
      <h2>
        {__("Edit Quiz:", "react-quiz-app")} {quiz.title}
      </h2>

      <div className="quiz-editor-questions">
        {editedQuestions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-editor">
            <div className="question-header">
              <h3>
                {__("Question", "react-quiz-app")} {questionIndex + 1}
              </h3>
              <button type="button" className="remove-question" onClick={() => handleRemoveQuestion(questionIndex)}>
                {__("Remove", "react-quiz-app")}
              </button>
            </div>

            <div className="question-text-editor">
              <label htmlFor={`question-${questionIndex}-text`}>{__("Question Text:", "react-quiz-app")}</label>
              <textarea
                id={`question-${questionIndex}-text`}
                value={question.text}
                onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
                placeholder={__("Enter question text", "react-quiz-app")}
              />
            </div>

            <div className="question-answers-editor">
              <h4>{__("Answer Choices:", "react-quiz-app")}</h4>

              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="answer-editor">
                  <input
                    type="radio"
                    id={`question-${questionIndex}-correct-${answerIndex}`}
                    name={`question-${questionIndex}-correct`}
                    checked={question.correctAnswer === answerIndex}
                    onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                  />
                  <label htmlFor={`question-${questionIndex}-correct-${answerIndex}`}>
                    {__("Correct", "react-quiz-app")}
                  </label>

                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                    placeholder={`${__("Answer", "react-quiz-app")} ${answerIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-editor-actions">
        <button type="button" className="add-question" onClick={handleAddQuestion}>
          {__("Add Question", "react-quiz-app")}
        </button>

        <button type="button" className="save-quiz" onClick={handleSave} disabled={saving}>
          {saving ? __("Saving...", "react-quiz-app") : __("Save Quiz", "react-quiz-app")}
        </button>

        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </div>
    </div>
  )
}

export default QuizEditor
