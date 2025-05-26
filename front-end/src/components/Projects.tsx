"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Project } from "../types"
import { useAuth } from "../context/AuthContext"

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
  })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/projects")
      setProjects(response.data)
      setError("")
    } catch (err: any) {
      setError("Failed to fetch projects")
      console.error("Error fetching projects:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Please login to create a project")
      return
    }
    try {
      await axios.post("http://localhost:5000/projects", newProject, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNewProject({ title: "", description: "", technologies: "" })
      fetchProjects()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject || !token) return

    try {
      await axios.put(
        `http://localhost:5000/projects/${editingProject.id}`,
        {
          title: editingProject.title,
          description: editingProject.description,
          technologies: editingProject.technologies,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setEditingProject(null)
      fetchProjects()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update project")
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Are you sure you want to delete this project?")) return

    try {
      await axios.delete(`http://localhost:5000/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchProjects()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingProject ? "Edit Project" : "Create New Project"}</h2>
          <form onSubmit={editingProject ? handleEdit : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={editingProject ? editingProject.title : newProject.title}
                  onChange={(e) =>
                    editingProject
                      ? setEditingProject({ ...editingProject, title: e.target.value })
                      : setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies
                </label>
                <input
                  type="text"
                  name="technologies"
                  id="technologies"
                  value={editingProject ? editingProject.technologies : newProject.technologies}
                  onChange={(e) =>
                    editingProject
                      ? setEditingProject({ ...editingProject, technologies: e.target.value })
                      : setNewProject({ ...newProject, technologies: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={editingProject ? editingProject.description : newProject.description}
                onChange={(e) =>
                  editingProject
                    ? setEditingProject({ ...editingProject, description: e.target.value })
                    : setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                {editingProject ? "Update Project" : "Create Project"}
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-3">{project.description}</p>
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500">Technologies:</span>
              <p className="text-sm text-blue-600">{project.technologies}</p>
            </div>
            {project.user && <p className="text-xs text-gray-500 mb-3">Created by: {project.user.name}</p>}
            {token && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No projects found.</p>
        </div>
      )}
    </div>
  )
}

export default Projects
