"use client"

import { createContext, useState, useContext, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("token", data.token)
      setToken(data.token)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  const value = {
    token,
    loading,
    error,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
