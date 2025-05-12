"use client"

import { useState } from "react"
import "../styles/Forms.css"

const ProjectForm = ({ onProjectCreated, token, onCancel }) => {
  const [projectData, setProjectData] = useState({
    project_name: "",
    status: "Pending",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project")
      }

      onProjectCreated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Create New Project</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project_name">Project Name</label>
          <input
            type="text"
            id="project_name"
            name="project_name"
            value={projectData.project_name}
            onChange={handleChange}
            placeholder="Enter project name"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={projectData.status} onChange={handleChange} disabled={loading}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
