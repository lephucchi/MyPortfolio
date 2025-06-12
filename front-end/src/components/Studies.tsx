"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import type { Study } from "../types"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Edit, Trash2, BookOpen, GraduationCap } from "lucide-react"
import Reactions from "./Reactions"
import type { Reaction } from "../types"

const Studies: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([])
  const [newStudy, setNewStudy] = useState({ title: "", content: "" })
  const [editingStudy, setEditingStudy] = useState<Study | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null) // State for detailed view
  const { token } = useAuth()
  const { isDark } = useTheme()

  const timelineRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetchStudies()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          } else {
            entry.target.classList.remove("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 }, // Trigger when 10% of the item is visible
    )

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      timelineRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [studies]) // Re-observe when studies data changes

  const fetchStudies = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/studies")
      setStudies(response.data)
      setError("")
    } catch (err: any) {
      setError("Failed to fetch studies")
      console.error("Error fetching studies:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Please login to add a study")
      return
    }
    try {
      await axios.post("http://localhost:5000/studies", newStudy, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNewStudy({ title: "", content: "" })
      fetchStudies()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create study")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStudy || !token) return

    try {
      await axios.put(
        `http://localhost:5000/studies/${editingStudy.id}`,
        {
          title: editingStudy.title,
          content: editingStudy.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setEditingStudy(null)
      fetchStudies()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update study")
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Are you sure you want to delete this study?")) return

    try {
      await axios.delete(`http://localhost:5000/studies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchStudies()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete study")
    }
  }

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be")
  }

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  const handleStudyReactionChange = (studyId: number, newReactions: Reaction[]) => {
    setStudies((prevStudies) =>
      prevStudies.map((study) => (study.id === studyId ? { ...study, reactions: newReactions } : study)),
    )
    if (selectedStudy && selectedStudy.id === studyId) {
      setSelectedStudy((prev) => (prev ? { ...prev, reactions: newReactions } : null))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading studies...</div>
      </div>
    )
  }

  if (selectedStudy) {
    // Detailed Study View
    return (
      <div
        className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
      >
        <button
          onClick={() => setSelectedStudy(null)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
        >
          <BookOpen size={18} />
          <span>Back to Studies List</span>
        </button>

        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{selectedStudy.title}</h1>
        <p className={`text-gray-500 mb-6 text-sm`}>
          By: {selectedStudy.author?.name} • {new Date(selectedStudy.createdAt).toLocaleDateString()}
        </p>

        <div className="mb-8">
          {isYouTubeUrl(selectedStudy.content) ? (
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(selectedStudy.content)}
                title={selectedStudy.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          ) : (
            <div className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} whitespace-pre-wrap`}>
              {selectedStudy.content}
            </div>
          )}
        </div>

        {/* Reactions for the study */}
        <div className="mb-8">
          <Reactions
            entityType="study"
            entityId={selectedStudy.id}
            initialReactions={selectedStudy.reactions}
            onReactionChange={(newReactions) => handleStudyReactionChange(selectedStudy.id, newReactions)}
          />
        </div>

        {token && (
          <div className="flex space-x-3 mt-8">
            <button
              onClick={() => setEditingStudy(selectedStudy)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center gap-2"
            >
              <Edit size={18} />
              <span>Edit Study</span>
            </button>
            <button
              onClick={() => handleDelete(selectedStudy.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
            >
              <Trash2 size={18} />
              <span>Delete Study</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // Studies Timeline View
  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        My <span className="text-blue-500">Learning Journey</span>
      </h1>
      <p className={`text-xl mb-12 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        A timeline of my studies and achievements
      </p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div
          className={`p-6 rounded-2xl shadow-md mb-12 ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingStudy ? "Edit Study Entry" : "Add New Study Entry"}
          </h2>
          <form onSubmit={editingStudy ? handleEdit : handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Title (e.g., "Learned Competitive Programming", "Built Portfolio Website")
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={editingStudy ? editingStudy.title : newStudy.title}
                onChange={(e) =>
                  editingStudy
                    ? setEditingStudy({ ...editingStudy, title: e.target.value })
                    : setNewStudy({ ...newStudy, title: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Content (Text or YouTube URL)
              </label>
              <textarea
                name="content"
                id="content"
                rows={4}
                value={editingStudy ? editingStudy.content : newStudy.content}
                onChange={(e) =>
                  editingStudy
                    ? setEditingStudy({ ...editingStudy, content: e.target.value })
                    : setNewStudy({ ...newStudy, content: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Enter study content or YouTube URL..."
                required
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                {editingStudy ? "Update Entry" : "Add Entry"}
              </button>
              {editingStudy && (
                <button
                  type="button"
                  onClick={() => setEditingStudy(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="relative py-8">
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${isDark ? "bg-gray-700" : "bg-gray-300"} rounded-full`}
        ></div>
        {studies
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((study, index) => (
            <div
              key={study.id}
              ref={(el) => { timelineRefs.current[index] = el }}
              className={`mb-8 flex w-full items-center opacity-0 transition-all duration-1000 ease-out ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "pr-8 md:pr-16" : "pl-8 md:pl-16"}`}>
                <div
                  className={`p-6 rounded-2xl shadow-lg ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                  onClick={() => setSelectedStudy(study)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {study.title}
                    </h2>
                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(study.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isYouTubeUrl(study.content) ? (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(study.content)}
                        title={study.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className={`text-gray-600 line-clamp-3 mb-4 ${isDark ? "text-gray-300" : ""}`}>
                      {study.content}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <Reactions
                      entityType="study"
                      entityId={study.id}
                      initialReactions={study.reactions}
                      onReactionChange={(newReactions) => handleStudyReactionChange(study.id, newReactions)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStudy(study)
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <BookOpen size={14} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 p-3 rounded-full ${isDark ? "bg-blue-600" : "bg-blue-500"} shadow-lg z-10`}
              >
                <GraduationCap size={20} className="text-white" />
              </div>
            </div>
          ))}
      </div>

      {studies.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className={`text-gray-500 ${isDark ? "text-gray-400" : ""}`}>No study entries found.</p>
        </div>
      )}
    </div>
  )
}

export default Studies
