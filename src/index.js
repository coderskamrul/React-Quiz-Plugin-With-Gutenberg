import React from "react"
import { createRoot } from "react-dom/client"

// Admin Pages
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings/Settings"
import Help from "./pages/Help/Help"

// Initialize Admin App
const initAdminApp = () => {
  const adminContainer = document.getElementById("react-quiz-app-admin")

  if (adminContainer) {
    const root = createRoot(adminContainer)

    // Determine which page to render based on the current page
    const { currentPage } = window.reactQuizAppAdmin || { currentPage: "dashboard" }

    let PageComponent

    switch (currentPage) {
      case "settings":
        PageComponent = Settings
        break
      case "help":
        PageComponent = Help
        break
      default:
        PageComponent = Dashboard
    }

    root.render(
      <React.StrictMode>
          <PageComponent />
      </React.StrictMode>,
    )
  }
}

