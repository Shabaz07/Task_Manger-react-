"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import "./App.css"

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
