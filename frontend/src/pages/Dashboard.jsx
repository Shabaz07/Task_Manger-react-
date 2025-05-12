"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ProjectList from "../components/ProjectList"
import ProjectForm from "../components/ProjectForm"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import "../styles/Dashboard.css"

const Dashboard = () => {
  const { logout, token } = useAuth()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [token])

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id)
    } else {
      setTasks([])
    }
  }, [selectedProject])

  const fetchProjects = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const data = await response.json()
      setProjects(data)

      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0])
      }
    } catch (err) {
      setError(err.message)
      console.error("Error fetching projects:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTasks = async (projectId) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:5000/tasks/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject])
    setSelectedProject(newProject)
    setShowProjectForm(false)
  }

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask])
    setShowTaskForm(false)
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Tracker</h1>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Projects</h2>
            <button onClick={() => setShowProjectForm(true)} className="add-button">
              + New Project
            </button>
          </div>

          {isLoading && !projects.length ? (
            <p className="loading">Loading projects...</p>
          ) : error && !projects.length ? (
            <p className="error">{error}</p>
          ) : (
            <ProjectList projects={projects} selectedProject={selectedProject} onSelectProject={setSelectedProject} />
          )}
        </aside>

        <main className="main-content">
          {selectedProject ? (
            <>
              <div className="main-header">
                <h2>{selectedProject.project_name}</h2>
                <div className="status-badge">Status: {selectedProject.status}</div>
                <button onClick={() => setShowTaskForm(true)} className="add-button">
                  + New Task
                </button>
              </div>

              {isLoading && !tasks.length ? (
                <p className="loading">Loading tasks...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                <TaskList tasks={tasks} onEditTask={handleEditTask} onDeleteTask={handleTaskDeleted} token={token} />
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>Select a project or create a new one</h3>
              <p>Projects help you organize your tasks</p>
            </div>
          )}
        </main>
      </div>

      {showProjectForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowProjectForm(false)}>
              &times;
            </button>
            <ProjectForm
              onProjectCreated={handleProjectCreated}
              token={token}
              onCancel={() => setShowProjectForm(false)}
            />
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => {
                setShowTaskForm(false)
                setEditingTask(null)
              }}
            >
              &times;
            </button>
            <TaskForm
              projectId={selectedProject?.id}
              task={editingTask}
              onTaskCreated={handleTaskCreated}
              onTaskUpdated={handleTaskUpdated}
              token={token}
              onCancel={() => {
                setShowTaskForm(false)
                setEditingTask(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
