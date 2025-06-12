"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import type { Project } from "../types"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Github, Upload, X, Code, Layers, FileCode, Terminal, ExternalLink } from "lucide-react"
import Reactions from "./Reactions"
import type { Reaction } from "../types"

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubLink: "",
    documentation: "",
    technologies: "", // Added technologies field for creation/edit
  })
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null) // State for detailed view
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
      formData.append("technologies", newProject.technologies) // Added technologies

      await axios.post("http://localhost:5000/projects/create", formData, {
        // Updated route
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setNewProject({ title: "", description: "", githubLink: "", documentation: "", technologies: "" })
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
      formData.append("technologies", editingProject.technologies || "") // Added technologies

      await axios.post(`http://localhost:5000/projects/update/${editingProject.id}`, formData, {
        // Updated route
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
      await axios.post(
        `http://localhost:5000/projects/remove/${id}`, // Updated route
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchProjects()
      setError("")
      setSelectedProject(null) // Close detail view if deleted
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project")
    }
  }

  const startEdit = (project: Project) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      githubLink: project.githubLink || "",
      documentation: project.documentation || "",
      technologies: project.technologies || "",
    })
    clearThumbnail()
  }

  const cancelEdit = () => {
    setEditingProject(null)
    setNewProject({ title: "", description: "", githubLink: "", documentation: "", technologies: "" })
    clearThumbnail()
  }

  const handleProjectReactionChange = (projectId: number, newReactions: Reaction[]) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => (project.id === projectId ? { ...project, reactions: newReactions } : project)),
    )
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => (prev ? { ...prev, reactions: newReactions } : null))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading projects...</div>
      </div>
    )
  }

  if (selectedProject) {
    // Detailed Project View
    return (
      <div
        className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
      >
        <button
          onClick={() => setSelectedProject(null)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
        >
          <Layers size={18} />
          <span>Back to All Projects</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Project Image */}
          <div className="lg:w-1/2">
            {selectedProject.thumbnailUrl ? (
              <img
                src={selectedProject.thumbnailUrl || "/placeholder.svg"}
                alt={selectedProject.title}
                className="w-full h-auto rounded-xl shadow-lg"
              />
            ) : (
              <div
                className={`h-64 rounded-xl flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <Code size={64} className={isDark ? "text-gray-500" : "text-gray-400"} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {selectedProject.technologies?.split(",").map((tech, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              {selectedProject.githubLink && (
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  <Github size={18} />
                  <span>View Code</span>
                </a>
              )}
              {selectedProject.documentation && (
                <a
                  href={selectedProject.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-colors`}
                >
                  <ExternalLink size={18} />
                  <span>Documentation</span>
                </a>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:w-1/2">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              {selectedProject.title}
            </h2>

            <div className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
            </div>

            {token && (
              <div className="mb-6">
                <Reactions
                  entityType="project"
                  entityId={selectedProject.id}
                  initialReactions={selectedProject.reactions}
                  onReactionChange={(newReactions) => handleProjectReactionChange(selectedProject.id, newReactions)}
                />
              </div>
            )}

            {token && (
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => startEdit(selectedProject)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Terminal size={18} />
                  <span>Edit Project</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedProject.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X size={18} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Project List View
  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        My <span className="text-blue-500">Projects</span>
      </h1>
      <p className={`text-xl mb-12 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        Showcasing my work and technical expertise
      </p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div
          className={`p-6 rounded-2xl shadow-md mb-12 ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingProject ? "Edit Project" : "Create New Project"}
          </h2>
          <form onSubmit={editingProject ? handleEdit : handleSubmit} className="space-y-6">
            {/* Thumbnail Upload */}
            <div>
              <label className={`block text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Project Thumbnail
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                {thumbnailPreview && (
                  <div className="relative">
                    <img
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className={`block text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="githubLink"
                  className={`block text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="https://github.com/username/repository"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="technologies"
                className={`block text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                name="technologies"
                id="technologies"
                value={editingProject ? editingProject.technologies || "" : newProject.technologies}
                onChange={(e) =>
                  editingProject
                    ? setEditingProject({ ...editingProject, technologies: e.target.value })
                    : setNewProject({ ...newProject, technologies: e.target.value })
                }
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className={`block text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
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
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="documentation"
                className={`block text-lg font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Documentation
              </label>
              <textarea
                name="documentation"
                id="documentation"
                rows={8}
                value={editingProject ? editingProject.documentation || "" : newProject.documentation}
                onChange={(e) =>
                  editingProject
                    ? setEditingProject({ ...editingProject, documentation: e.target.value })
                    : setNewProject({ ...newProject, documentation: e.target.value })
                }
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Project documentation, setup instructions, features, etc."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting && <Upload className="animate-spin" size={20} />}
                <span>{submitting ? "Uploading..." : editingProject ? "Update Project" : "Create Project"}</span>
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
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
            onClick={() => setSelectedProject(project)}
            className={`rounded-2xl border overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm`}
          >
            {project.thumbnailUrl ? (
              <div className="h-48 overflow-hidden">
                <img
                  src={project.thumbnailUrl || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ) : (
              <div className={`h-48 flex items-center justify-center ${isDark ? "bg-gray-700/50" : "bg-gray-100"}`}>
                <Code size={48} className={isDark ? "text-gray-500" : "text-gray-400"} />
              </div>
            )}
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {project.title}
              </h2>
              <p className={`line-clamp-2 mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-full ${
                        isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Github size={16} className={isDark ? "text-gray-300" : "text-gray-700"} />
                    </a>
                  )}
                  {project.technologies && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {project.technologies.split(",")[0].trim()} {/* Show only first technology */}
                    </span>
                  )}
                </div>
                <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>View details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>No projects found.</p>
        </div>
      )}

      {token && (
        <div className="mt-12 text-center">
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
          >
            <FileCode size={20} />
            <span>Create New Project</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Projects
