"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Hobby } from "../types"
import { useAuth } from "../context/AuthContext"

const Hobbies: React.FC = () => {
  const [hobbies, setHobbies] = useState<Hobby[]>([])
  const [newHobby, setNewHobby] = useState({ name: "", description: "" })
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { token } = useAuth()

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading hobbies...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Hobbies</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingHobby ? "Edit Hobby" : "Add New Hobby"}</h2>
          <form onSubmit={editingHobby ? handleEdit : handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div key={hobby.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">{hobby.name}</h2>
            <p className="text-gray-600 mb-4">{hobby.description}</p>
            {hobby.user && <p className="text-xs text-gray-500 mb-3">Added by: {hobby.user.name}</p>}
            {token && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingHobby(hobby)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hobby.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {hobbies.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hobbies found.</p>
        </div>
      )}
    </div>
  )
}

export default Hobbies
