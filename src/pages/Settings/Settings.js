// "use client"

import { useState } from "react"
import { __ } from "@wordpress/i18n"

const Settings = () => {
  const [settings, setSettings] = useState({
    showAllQuestions: false,
    showCorrectAnswers: true,
    storeResults: true,
  })


  return (
    <div className="settings-container">
      <h1>{__("Quiz Settings", "react-quiz-app")}</h1>

    </div>
  )
}

export default Settings
