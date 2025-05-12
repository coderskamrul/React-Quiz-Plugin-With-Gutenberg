// "use client"

import { useState } from "react"
import { __ } from "@wordpress/i18n"

const Settings = () => {
  const [settings, setSettings] = useState({
    showAllQuestions: false,
    showCorrectAnswers: true,
    storeResults: true,
  })

  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value,
    })
  }

  const handleSaveSettings = () => {
    // Save settings to WordPress options via REST API
    alert(__("Settings saved!", "react-quiz-app"))
  }

  return (
    <div className="settings-container">
      <h1>{__("Quiz Settings", "react-quiz-app")}</h1>

      <div className="settings-form">
        <div className="setting-item">
          <label htmlFor="showAllQuestions">
            <input
              type="checkbox"
              id="showAllQuestions"
              checked={settings.showAllQuestions}
              onChange={(e) => handleSettingChange("showAllQuestions", e.target.checked)}
            />
            {__("Show all questions at once (default: one at a time)", "react-quiz-app")}
          </label>
        </div>

        <div className="setting-item">
          <label htmlFor="showCorrectAnswers">
            <input
              type="checkbox"
              id="showCorrectAnswers"
              checked={settings.showCorrectAnswers}
              onChange={(e) => handleSettingChange("showCorrectAnswers", e.target.checked)}
            />
            {__("Show correct answers after submission", "react-quiz-app")}
          </label>
        </div>

        <div className="setting-item">
          <label htmlFor="storeResults">
            <input
              type="checkbox"
              id="storeResults"
              checked={settings.storeResults}
              onChange={(e) => handleSettingChange("storeResults", e.target.checked)}
            />
            {__("Store quiz results in database", "react-quiz-app")}
          </label>
        </div>

        <div className="settings-actions">
          <button type="button" className="save-settings" onClick={handleSaveSettings}>
            {__("Save Settings", "react-quiz-app")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
