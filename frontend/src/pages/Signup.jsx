"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Auth.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  })
  const [formError, setFormError] = useState("")
  const { signup, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (!formData.name || !formData.email || !formData.password || !formData.country) {
      setFormError("Please fill in all fields")
      return
    }

    const success = await signup(formData)
    if (success) {
      navigate("/login")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {(formError || error) && <div className="error-message">{formError || error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter your country"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
