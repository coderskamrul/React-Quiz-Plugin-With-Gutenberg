import { __ } from "@wordpress/i18n"

const Help = () => {
  return (
    <div className="help-container">
      <h1>{__("Quiz App Help", "react-quiz-app")}</h1>

      <div className="help-content">
        <section className="help-section">
          <h2>{__("Getting Started", "react-quiz-app")}</h2>
          <p>
            {__(
              "Welcome to the React Quiz App! This plugin allows you to create interactive multiple-choice quizzes for your WordPress site.",
              "react-quiz-app",
            )}
          </p>
          <p>
            {__(
              "To get started, create a new quiz from the WordPress admin menu by going to Quizzes > Add New.",
              "react-quiz-app",
            )}
          </p>
        </section>

        <section className="help-section">
          <h2>{__("Creating a Quiz", "react-quiz-app")}</h2>
          <ol>
            <li>{__("Go to Quizzes > Add New", "react-quiz-app")}</li>
            <li>{__("Enter a title for your quiz", "react-quiz-app")}</li>
            <li>{__("Publish the quiz", "react-quiz-app")}</li>
            <li>{__("Go to Quiz App > Dashboard", "react-quiz-app")}</li>
            <li>{__("Select your quiz from the list", "react-quiz-app")}</li>
            <li>{__("Add questions and answers", "react-quiz-app")}</li>
            <li>{__("Save your changes", "react-quiz-app")}</li>
          </ol>
        </section>

        <section className="help-section">
          <h2>{__("Adding a Quiz to a Post or Page", "react-quiz-app")}</h2>
          <ol>
            <li>{__("Edit the post or page where you want to add the quiz", "react-quiz-app")}</li>
            <li>{__('Add a new block and search for "Quiz"', "react-quiz-app")}</li>
            <li>{__("Select the Quiz block", "react-quiz-app")}</li>
            <li>{__("Choose your quiz from the dropdown menu", "react-quiz-app")}</li>
            <li>{__("Save or update the post", "react-quiz-app")}</li>
          </ol>
        </section>

        <section className="help-section">
          <h2>{__("Viewing Quiz Results", "react-quiz-app")}</h2>
          <p>
            {__(
              'Quiz results are stored in the database and can be viewed from the Quiz App dashboard. Select a quiz and click on the "View Results" tab to see all submissions for that quiz.',
              "react-quiz-app",
            )}
          </p>
        </section>

        <section className="help-section">
          <h2>{__("Need More Help?", "react-quiz-app")}</h2>
          <p>
            {__(
              "If you need additional assistance, please contact our support team at support@example.com.",
              "react-quiz-app",
            )}
          </p>
        </section>
      </div>
    </div>
  )
}

export default Help
