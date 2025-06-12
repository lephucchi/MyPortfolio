"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Hobby, Reaction } from "../types"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Edit, Trash2, BookOpen } from "lucide-react"
import Reactions from "./Reactions"

const Hobbies: React.FC = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [newHobby, setNewHobby] = useState({ name: "", description: "" })
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null) // State for detailed view
  const { token } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    fetchHobbies()
  }, [])

  const fetchHobbies = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/hobbies")
      setHobbies(response.data)
      setError("")
    } catch (err: any) {
      setError("Failed to fetch hobbies")
      console.error("Error fetching hobbies:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Please login to add a hobby")
      return
    }
    try {
      await axios.post("http://localhost:5000/hobbies", newHobby, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNewHobby({ name: "", description: "" })
      fetchHobbies()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create hobby")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingHobby || !token) return

    try {
      await axios.put(
        `http://localhost:5000/hobbies/${editingHobby.id}`,
        {
          name: editingHobby.name,
          description: editingHobby.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setEditingHobby(null)
      fetchHobbies()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update hobby")
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Are you sure you want to delete this hobby?")) return

    try {
      await axios.delete(`http://localhost:5000/hobbies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchHobbies()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete hobby")
    }
  }

  const handleHobbyReactionChange = (hobbyId: number, newReactions: Reaction[]) => {
    setHobbies((prevHobbies) =>
      prevHobbies.map((hobby) => (hobby.id === hobbyId ? { ...hobby, reactions: newReactions } : hobby)),
    )
    if (selectedHobby && selectedHobby.id === hobbyId) {
      setSelectedHobby((prev) => (prev ? { ...prev, reactions: newReactions } : null))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading hobbies...</div>
      </div>
    )
  }

  if (selectedHobby) {
    // Detailed Hobby View
    return (
      <div
        className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
      >
        <button
          onClick={() => setSelectedHobby(null)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
        >
          <BookOpen size={18} />
          <span>Back to Hobbies List</span>
        </button>

        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{selectedHobby.name}</h1>
        <p className={`text-gray-500 mb-6 text-sm`}>
          Added by: {selectedHobby.user?.name} • {new Date(selectedHobby.createdAt).toLocaleDateString()}
        </p>

        <div className={`mb-8 ${isDark ? "text-gray-300" : "text-gray-600"} whitespace-pre-wrap`}>
          {selectedHobby.description}
        </div>

        {/* Reactions for the hobby */}
        <div className="mb-8">
          <Reactions
            entityType="hobby"
            entityId={selectedHobby.id}
            initialReactions={selectedHobby.reactions}
            onReactionChange={(newReactions) => handleHobbyReactionChange(selectedHobby.id, newReactions)}
          />
        </div>

        {token && (
          <div className="flex space-x-3 mt-8">
            <button
              onClick={() => setEditingHobby(selectedHobby)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center gap-2"
            >
              <Edit size={18} />
              <span>Edit Hobby</span>
            </button>
            <button
              onClick={() => handleDelete(selectedHobby.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
            >
              <Trash2 size={18} />
              <span>Delete Hobby</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // Hobby List View
  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        My <span className="text-blue-500">Hobbies</span>
      </h1>
      <p className={`text-xl mb-12 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        Things I enjoy doing in my free time
      </p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div
          className={`p-6 rounded-2xl shadow-md mb-12 ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingHobby ? "Edit Hobby" : "Add New Hobby"}
          </h2>
          <form onSubmit={editingHobby ? handleEdit : handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Hobby Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editingHobby ? editingHobby.name : newHobby.name}
                onChange={(e) =>
                  editingHobby
                    ? setEditingHobby({ ...editingHobby, name: e.target.value })
                    : setNewHobby({ ...newHobby, name: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div>
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
                value={editingHobby ? editingHobby.description : newHobby.description}
                onChange={(e) =>
                  editingHobby
                    ? setEditingHobby({ ...editingHobby, description: e.target.value })
                    : setNewHobby({ ...newHobby, description: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                {editingHobby ? "Update Hobby" : "Add Hobby"}
              </button>
              {editingHobby && (
                <button
                  type="button"
                  onClick={() => setEditingHobby(null)}
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
        {hobbies.map((hobby) => (
          <div
            key={hobby.id}
            onClick={() => setSelectedHobby(hobby)}
            className={`rounded-2xl border overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm`}
          >
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{hobby.name}</h2>
              <p className={`text-gray-600 line-clamp-3 mb-4 ${isDark ? "text-gray-300" : ""}`}>{hobby.description}</p>
              <div className="flex items-center justify-between">
                {hobby.user && (
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Added by: {hobby.user.name}</p>
                )}
                <Reactions
                  entityType="hobby"
                  entityId={hobby.id}
                  initialReactions={hobby.reactions}
                  onReactionChange={(newReactions) => handleHobbyReactionChange(hobby.id, newReactions)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {hobbies.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className={`text-gray-500 ${isDark ? "text-gray-400" : ""}`}>No hobbies found.</p>
        </div>
      )}
    </div>
  )
}

export default Hobbies
