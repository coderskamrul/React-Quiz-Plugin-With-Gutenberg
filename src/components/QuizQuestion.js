import { useQuiz } from "../contexts/QuizContext"

const QuizQuestion = ({ question, questionIndex, userAnswer }) => {
  const { setUserAnswer } = useQuiz()

  const handleAnswerSelect = (answerId) => {
    setUserAnswer(questionIndex, answerId)
  }

  if (!question) {
    return null
  }

  return (
    <div className="quiz-question">
      <h3 className="question-text">{question.text}</h3>

      <div className="question-answers">
        {question.answers.map((answer, index) => (
          <div
            key={index}
            className={`answer-option ${userAnswer === index ? "selected" : ""}`}
            onClick={() => handleAnswerSelect(index)}
          >
            <input
              type="radio"
              id={`question-${questionIndex}-answer-${index}`}
              name={`question-${questionIndex}`}
              value={index}
              checked={userAnswer === index}
              onChange={() => handleAnswerSelect(index)}
            />
            <label htmlFor={`question-${questionIndex}-answer-${index}`}>{answer}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion
