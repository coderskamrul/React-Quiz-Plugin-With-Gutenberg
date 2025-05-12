import { __ } from "@wordpress/i18n"

const QuizResult = ({ score, questions, userAnswers, onReset, submitResult }) => {
  // Use the submitResult data if available, otherwise fall back to the calculated score
  const resultData = submitResult || {
    score: score,
    correctCount: Object.keys(userAnswers).filter(
      (questionId) => userAnswers[questionId] === questions[questionId].correctAnswer,
    ).length,
    totalQuestions: questions.length,
  }

  return (
    <div className="quiz-result">
      <h2 className="result-title">{__("Quiz Results", "react-quiz-app")}</h2>

      <div className="result-score">
        <p className="score-text">
          {__("Your Score:", "react-quiz-app")} {resultData.score.toFixed(2)}%
        </p>
        <p className="score-details">
          {__("You answered", "react-quiz-app")} {resultData.correctCount} {__("out of", "react-quiz-app")}{" "}
          {resultData.totalQuestions} {__("questions correctly.", "react-quiz-app")}
        </p>
      </div>

      <div className="result-questions">
        <h3>{__("Review Your Answers", "react-quiz-app")}</h3>

        {questions.map((question, index) => {
          const userAnswer = userAnswers[index]
          const isCorrect = userAnswer === question.correctAnswer

          return (
            <div key={index} className={`result-question ${isCorrect ? "correct" : "incorrect"}`}>
              <p className="question-text">{question.text}</p>

              <div className="question-answers">
                {question.answers.map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className={`answer-option ${userAnswer === answerIndex ? "user-selected" : ""} ${
                      question.correctAnswer === answerIndex ? "correct-answer" : ""
                    }`}
                  >
                    <span className="answer-text">{answer}</span>

                    {userAnswer === answerIndex && userAnswer !== question.correctAnswer && (
                      <span className="answer-indicator wrong">{__("Your answer", "react-quiz-app")}</span>
                    )}

                    {question.correctAnswer === answerIndex && (
                      <span className="answer-indicator correct">{__("Correct answer", "react-quiz-app")}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="result-actions">
        <button type="button" className="reset-button" onClick={onReset}>
          {__("Take Quiz Again", "react-quiz-app")}
        </button>
      </div>
    </div>
  )
}

export default QuizResult
