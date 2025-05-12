"use client"

import "../styles/TaskList.css"

const TaskList = ({ tasks, onEditTask, onDeleteTask, token }) => {
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      onDeleteTask(taskId)
    } catch (err) {
      console.error("Error deleting task:", err)
      alert("Failed to delete task")
    }
  }

  if (!tasks.length) {
    return <p className="no-tasks">No tasks found. Create your first task!</p>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className={`task-status ${task.status.toLowerCase()}`}>{task.status}</div>
          </div>

          <p className="task-description">{task.description}</p>

          <div className="task-dates">
            <div className="task-date">
              <span>Created:</span> {new Date(task.date_of_creation).toLocaleDateString()}
            </div>
            {task.date_of_completion && (
              <div className="task-date">
                <span>Completed:</span> {new Date(task.date_of_completion).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="task-actions">
            <button className="edit-button" onClick={() => onEditTask(task)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList
