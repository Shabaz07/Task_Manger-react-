import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

// Enable CORS for development
const enableCors = () => {
  const originalFetch = window.fetch
  window.fetch = (url, options = {}) => {
    // Add CORS headers to all requests
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    }

    options.mode = "cors"

    return originalFetch(url, options)
  }
}

// Call the function to enable CORS
enableCors()

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
