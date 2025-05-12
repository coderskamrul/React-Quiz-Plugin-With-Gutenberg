import { __ } from "@wordpress/i18n"

const QuizResult = ({ score, questions, userAnswers, onReset, submitResult }) => {
  // Use the submitResult data if available, otherwise fall back to the calculated score
 

  return (
    <div className="quiz-result">
      <h2 className="result-title">{__("Quiz Results", "react-quiz-app")}</h2>


    </div>
  )
}

export default QuizResult
