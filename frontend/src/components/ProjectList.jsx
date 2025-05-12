"use client"

import "../styles/ProjectList.css"

const ProjectList = ({ projects, selectedProject, onSelectProject }) => {
  if (!projects.length) {
    return <p className="no-projects">No projects found. Create your first project!</p>
  }

  return (
    <div className="project-list">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`project-item ${selectedProject?.id === project.id ? "selected" : ""}`}
          onClick={() => onSelectProject(project)}
        >
          <div className="project-name">{project.project_name}</div>
          <div className={`project-status ${project.status.toLowerCase()}`}>{project.status}</div>
        </div>
      ))}
    </div>
  )
}

export default ProjectList
