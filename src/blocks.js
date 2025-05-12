import { registerBlockType } from "@wordpress/blocks"
import { SelectControl, Button, Spinner, Notice } from "@wordpress/components"
import { useEffect, useState } from "@wordpress/element"
import { useBlockProps } from "@wordpress/block-editor"
import { __ } from "@wordpress/i18n"

// Register the block
registerBlockType("react-quiz-app/quiz-block", {
  title: __("Quiz", "react-quiz-app"),
  icon: "list-view",
  category: "widgets",
  attributes: {
    quizId: {
      type: "number",
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const { quizId } = attributes
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [debugInfo, setDebugInfo] = useState(null)


    const blockProps = useBlockProps({
      className: "react-quiz-app-block-editor",
    })

    const quizOptions = [
      { label: __("Select a quiz", "react-quiz-app"), value: "" },
      ...quizzes.map((quiz) => ({
        label: quiz.title,
        value: quiz.id,
      })),
    ]

    return (
      <div {...blockProps}>
        <div className="quiz-block-editor">
          <h3>{__("Quiz Block", "react-quiz-app")}</h3>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Spinner />
              <p>{__("Loading...", "react-quiz-app")}</p>
            </div>
          ) : error ? (
            <div className="quiz-block-error">
              <Notice status="error" isDismissible={false}>
                <p>
                  {__("Error loading quizzes:", "react-quiz-app")} {error}
                </p>
              </Notice>

              <div style={{ marginTop: "10px" }}>
                <Button variant="secondary" onClick={fetchQuizzes}>
                  {__("Try Again", "react-quiz-app")}
                </Button>
              </div>

              {debugInfo && (
                <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                  <h4>{__("Debug Information", "react-quiz-app")}</h4>
                  <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </div>
          ) : quizzes.length === 0 ? (
            <div>
              <Notice status="warning" isDismissible={false}>
                <p>{__("No quizzes found. Please create a quiz first.", "react-quiz-app")}</p>
              </Notice>
              <div style={{ marginTop: "10px" }}>
                <Button
                  variant="secondary"
                  href={`${window.wpAdminSettings?.adminUrl || "/wp-admin/"}post-new.php?post_type=quiz`}
                >
                  {__("Create a Quiz", "react-quiz-app")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <SelectControl
                label={__("Select Quiz", "react-quiz-app")}
                value={quizId}
                options={quizOptions}
                onChange={(value) => setAttributes({ quizId: value ? Number.parseInt(value, 10) : null })}
              />

              {quizId ? (
                <div className="quiz-block-preview">
                  <p>
                    {__("Selected Quiz:", "react-quiz-app")} {quizzes.find((q) => q.id === quizId)?.title}
                  </p>
                  <p className="quiz-block-note">
                    {__("The quiz will be displayed here on the frontend.", "react-quiz-app")}
                  </p>
                </div>
              ) : (
                <p className="quiz-block-placeholder">{__("Please select a quiz to display.", "react-quiz-app")}</p>
              )}
            </>
          )}
        </div>
      </div>
    )
  },

  save: () => {
    return null
  },
})
