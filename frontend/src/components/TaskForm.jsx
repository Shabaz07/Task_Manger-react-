"use client"

import { useState, useEffect } from "react"
import "../styles/Forms.css"

const TaskForm = ({ projectId, task, onTaskCreated, onTaskUpdated, token, onCancel }) => {
  const [taskData, setTaskData] = useState({
    project_id: projectId,
    title: "",
    description: "",
    status: "Pending",
    date_of_completion: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEditing = !!task

  useEffect(() => {
    if (task) {
      // Format date for input field if it exists
      const formattedDate = task.date_of_completion ? new Date(task.date_of_completion).toISOString().split("T")[0] : ""

      setTaskData({
        project_id: task.project_id,
        title: task.title,
        description: task.description,
        status: task.status,
        date_of_completion: formattedDate,
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        // Update existing task
        const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to update task")
        }

        onTaskUpdated(data)
      } else {
        // Create new task
        const response = await fetch("http://localhost:5000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create task")
        }

        onTaskCreated(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            required
            disabled={loading}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={taskData.status} onChange={handleChange} disabled={loading}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date_of_completion">Completion Date</label>
          <input
            type="date"
            id="date_of_completion"
            name="date_of_completion"
            value={taskData.date_of_completion}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
