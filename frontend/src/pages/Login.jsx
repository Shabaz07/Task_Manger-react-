"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Auth.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!email || !password) {
      setFormError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate("/")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Task Tracker</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {(formError || error) && <div className="error-message">{formError || error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
