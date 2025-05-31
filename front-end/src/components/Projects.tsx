"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import type { Project } from "../types"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Github, ExternalLink, Upload, X } from "lucide-react"

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubLink: "",
    documentation: "",
  })
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const { token } = useAuth()
  const { isDark } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Please login to create a project")
      return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()

      if (thumbnail) {
        formData.append("thumbnail", thumbnail)
      }
      formData.append("title", newProject.title)
      formData.append("description", newProject.description)
      formData.append("githubLink", newProject.githubLink)
      formData.append("documentation", newProject.documentation)

      await axios.post("http://localhost:5000/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setNewProject({ title: "", description: "", githubLink: "", documentation: "" })
      clearThumbnail()
      fetchProjects()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject || !token) return

    try {
      setSubmitting(true)
      const formData = new FormData()

      if (thumbnail) {
        formData.append("thumbnail", thumbnail)
      }
      formData.append("title", editingProject.title)
      formData.append("description", editingProject.description)
      formData.append("githubLink", editingProject.githubLink || "")
      formData.append("documentation", editingProject.documentation || "")

      await axios.put(`http://localhost:5000/projects/${editingProject.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setEditingProject(null)
      clearThumbnail()
      fetchProjects()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update project")
    } finally {
      setSubmitting(false)
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

  const startEdit = (project: Project) => {
    setEditingProject(project)
    clearThumbnail()
  }

  const cancelEdit = () => {
    setEditingProject(null)
    clearThumbnail()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Projects</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div className={`p-6 rounded-lg shadow-md mb-8 ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingProject ? "Edit Project" : "Create New Project"}
          </h2>
          <form onSubmit={editingProject ? handleEdit : handleSubmit}>
            {/* Thumbnail Upload */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Project Thumbnail
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                {thumbnailPreview && (
                  <div className="relative">
                    <img
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="title"
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
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
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="githubLink"
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  GitHub Link
                </label>
                <input
                  type="url"
                  name="githubLink"
                  id="githubLink"
                  value={editingProject ? editingProject.githubLink || "" : newProject.githubLink}
                  onChange={(e) =>
                    editingProject
                      ? setEditingProject({ ...editingProject, githubLink: e.target.value })
                      : setNewProject({ ...newProject, githubLink: e.target.value })
                  }
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="https://github.com/username/repository"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
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
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="documentation"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Documentation
              </label>
              <textarea
                name="documentation"
                id="documentation"
                rows={6}
                value={editingProject ? editingProject.documentation || "" : newProject.documentation}
                onChange={(e) =>
                  editingProject
                    ? setEditingProject({ ...editingProject, documentation: e.target.value })
                    : setNewProject({ ...newProject, documentation: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Project documentation, setup instructions, features, etc."
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting && <Upload className="animate-spin" size={16} />}
                <span>{submitting ? "Uploading..." : editingProject ? "Update Project" : "Create Project"}</span>
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={cancelEdit}
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
          <div
            key={project.id}
            className={`rounded-lg shadow-md overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            {project.thumbnailUrl && (
              <img
                src={project.thumbnailUrl || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {project.title}
              </h2>
              <p className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{project.description}</p>

              {project.documentation && (
                <div className="mb-3">
                  <h4 className={`text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Documentation:
                  </h4>
                  <p className={`text-sm whitespace-pre-wrap ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {project.documentation}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3 mb-3">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                  >
                    <Github size={16} />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {project.technologies && (
                  <div className="flex items-center space-x-1">
                    <ExternalLink size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {project.technologies}
                    </span>
                  </div>
                )}
              </div>

              {project.user && (
                <p className={`text-xs mb-3 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  Created by: {project.user.name}
                </p>
              )}

              {token && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(project)}
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
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>No projects found.</p>
        </div>
      )}
    </div>
  )
}

export default Projects
