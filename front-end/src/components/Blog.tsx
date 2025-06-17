"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import type { BlogPost, Comment } from "../types"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Edit, Trash2, BookOpen } from "lucide-react"
import Reactions from "./Reactions"
import type { Reaction } from "../types"

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({})
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({})
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null) // State for detailed view
  const { token } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/blog-posts")
      setPosts(response.data)
      setError("")
    } catch (err: any) {
      setError("Failed to fetch blog posts")
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/comments/${postId}`) // Updated route
      setComments((prev) => ({ ...prev, [postId]: response.data }))
    } catch (err: any) {
      console.error("Error fetching comments:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Please login to create a post")
      return
    }
    try {
      await axios.post("http://localhost:5000/blog-posts/upload", newPost, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNewPost({ title: "", content: "" })
      fetchPosts()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost || !token) return

    try {
      await axios.put(
        `http://localhost:5000/blog-posts/${editingPost.id}`,
        {
          title: editingPost.title,
          content: editingPost.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setEditingPost(null)
      fetchPosts()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update post")
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Are you sure you want to delete this post?")) return

    try {
      await axios.delete(`http://localhost:5000/blog-posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPosts()
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete post")
    }
  }

  const handleCommentSubmit = async (postId: number) => {
    if (!token || !newComment[postId]?.trim()) return

    try {
      await axios.post(
        "http://localhost:5000/comments",
        {
          content: newComment[postId],
          postId: postId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setNewComment((prev) => ({ ...prev, [postId]: "" }))
      fetchComments(postId)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add comment")
    }
  }

  const handleCommentDelete = async (commentId: number, postId: number) => {
    if (!token || !confirm("Are you sure you want to delete this comment?")) return

    try {
      await axios.post(
        `http://localhost:5000/comments/${commentId}/delete`, // Updated route
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      fetchComments(postId)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete comment")
    }
  }

  const handlePostReactionChange = (postId: number, newReactions: Reaction[]) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, reactions: newReactions } : post)))
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, reactions: newReactions } : null))
    }
  }

  const handleCommentReactionChange = (commentId: number, newReactions: Reaction[]) => {
    setComments((prevComments) => {
      const updatedComments = { ...prevComments }
      for (const postId in updatedComments) {
        updatedComments[postId] = updatedComments[postId].map((comment) =>
          comment.id === commentId ? { ...comment, reactions: newReactions } : comment,
        )
      }
      return updatedComments
    })
    if (selectedPost) {
      setSelectedPost((prev) => {
        if (!prev) return null
        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.id === commentId ? { ...comment, reactions: newReactions } : comment,
          ),
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Loading blog posts...</div>
      </div>
    )
  }

  if (selectedPost) {
    // Detailed Blog Post View
    return (
      <div
        className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
      >
        <button
          onClick={() => setSelectedPost(null)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } transition-colors`}
        >
          <BookOpen size={18} />
          <span>Back to Blog List</span>
        </button>

        <h1 className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{selectedPost.title}</h1>
        <p className={`text-gray-500 mb-6 text-sm`}>
          By: {selectedPost.author?.name} • {new Date(selectedPost.createdAt).toLocaleDateString()}
        </p>

        <div className={`mb-8 ${isDark ? "text-gray-300" : "text-gray-600"} whitespace-pre-wrap`}>
          {selectedPost.content}
        </div>

        {/* Reactions for the post */}
        <div className="mb-8">
          <Reactions
            entityType="blogPost"
            entityId={selectedPost.id}
            initialReactions={selectedPost.reactions}
            onReactionChange={(newReactions) => handlePostReactionChange(selectedPost.id, newReactions)}
          />
        </div>

        {/* Comments Section */}
        <div className="border-t pt-6 mt-6">
          <h3 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Comments</h3>

          {token && (
            <div className="mb-6">
              <div className="flex space-x-2">
                <textarea
                  value={newComment[selectedPost.id] || ""}
                  onChange={(e) => setNewComment((prev) => ({ ...prev, [selectedPost.id]: e.target.value }))}
                  placeholder="Add a comment..."
                  rows={3}
                  className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <button
                  onClick={() => handleCommentSubmit(selectedPost.id)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          )}

          {comments[selectedPost.id] && comments[selectedPost.id].length > 0 ? (
            <div className="space-y-4">
              {comments[selectedPost.id].map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"} border ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{comment.user?.name}</p>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {token && (
                      <button
                        onClick={() => handleCommentDelete(comment.id, selectedPost.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full"
                        aria-label="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className={`mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{comment.content}</p>
                  <Reactions
                    entityType="comment"
                    entityId={comment.id}
                    initialReactions={comment.reactions}
                    onReactionChange={(newReactions) => handleCommentReactionChange(comment.id, newReactions)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>No comments yet.</p>
          )}
        </div>
      </div>
    )
  }

  // Blog Post List View
  return (
    <div className="container mx-auto p-4">
      <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        My <span className="text-blue-500">Blog</span>
      </h1>
      <p className={`text-xl mb-12 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
        Thoughts, insights, and technical deep-dives
      </p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {token && (
        <div
          className={`p-6 rounded-2xl shadow-md mb-12 ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingPost ? "Edit Post" : "Create New Post"}
          </h2>
          <form onSubmit={editingPost ? handleEdit : handleSubmit} className="space-y-4">
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
                value={editingPost ? editingPost.title : newPost.title}
                onChange={(e) =>
                  editingPost
                    ? setEditingPost({ ...editingPost, title: e.target.value })
                    : setNewPost({ ...newPost, title: e.target.value })
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
                Content
              </label>
              <textarea
                name="content"
                id="content"
                rows={6}
                value={editingPost ? editingPost.content : newPost.content}
                onChange={(e) =>
                  editingPost
                    ? setEditingPost({ ...editingPost, content: e.target.value })
                    : setNewPost({ ...newPost, content: e.target.value })
                }
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                {editingPost ? "Update Post" : "Create Post"}
              </button>
              {editingPost && (
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-6 rounded-2xl shadow-md ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`text-2xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {post.title}
                </h2>
                <p className={`text-gray-500 text-sm`}>
                  By: {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {token && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className={`text-gray-600 whitespace-pre-wrap line-clamp-3 mb-4 ${isDark ? "text-gray-300" : ""}`}>
              {post.content}
            </p>
            <div className="flex items-center justify-between">
              <Reactions
                entityType="blogPost"
                entityId={post.id}
                initialReactions={post.reactions}
                onReactionChange={(newReactions) => handlePostReactionChange(post.id, newReactions)}
              />
              <button
                onClick={() => {
                  setSelectedPost(post)
                  fetchComments(post.id)
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <BookOpen size={16} />
                <span>Read More</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className={`text-gray-500 ${isDark ? "text-gray-400" : ""}`}>No blog posts found.</p>
        </div>
      )}
    </div>
  )
}

export default Blog
