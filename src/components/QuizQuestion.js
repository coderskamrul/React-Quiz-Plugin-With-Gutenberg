
const QuizQuestion = ({ question, questionIndex, userAnswer }) => {


  if (!question) {
    return null
  }

  return (
    <div className="quiz-question">
      <h3 className="question-text">{question.text}</h3>

    </div>
  )
}

export default QuizQuestion
