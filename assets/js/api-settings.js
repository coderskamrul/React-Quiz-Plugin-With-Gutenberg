/**
 * Small script to make the wpApiSettings available globally
 * This is needed when wp-api is not enqueued
 */
;(() => {
  // Make sure wpApiSettings is available globally
  window.wpApiSettings = window.wpApiSettings || {
    root: "",
    nonce: "",
    current_user_id: 0,
  }

  // Log to console for debugging
  console.log("React Quiz App: API settings loaded", window.wpApiSettings)
})()
