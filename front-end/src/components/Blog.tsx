"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { BlogPost, Comment } from "../types"
import { useAuth } from "../context/AuthContext"

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({})
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({})
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false)
  const { token, role } = useAuth()

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
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/comments/${postId}`)
      setComments((prev) => ({ ...prev, [postId]: response.data }))
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Please login to create a post")
      return
    }
    try {
      await axios.post(
        "http://localhost:5000/blog-posts",
        newPost,
        { headers: { Authorization: `Bearer ${token}` } }
      )
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
        }
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
          blogPostId: postId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setNewComment((prev) => ({ ...prev, [postId]: "" }))
      fetchComments(postId)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add comment")
    }
  }

  // Chỉ ADMIN mới được phép bật panel quản trị
  const canEdit = role === "ADMIN" || role === "MODERATOR"
  const isAdmin = role === "ADMIN"

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading blog posts...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Nút Edit chỉ hiện với ADMIN */}
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            className={`px-4 py-2 rounded-md font-semibold ${showAdminPanel ? "bg-gray-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            onClick={() => setShowAdminPanel((prev) => !prev)}
          >
            {showAdminPanel ? "Hide Admin Panel" : "Edit"}
          </button>
        </div>
      )}

      {/* Panel quản trị chỉ hiện khi ADMIN bấm Edit */}
      {token && canEdit && showAdminPanel && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingPost ? "Edit Post" : "Create New Post"}</h2>
          <form onSubmit={editingPost ? handleEdit : handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
                <p className="text-gray-500 mt-3 text-sm">
                  By: {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Chỉ hiện các nút Edit/Delete khi ADMIN bật panel */}
              {token && canEdit && showAdminPanel && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Comments</h3>
                <button onClick={() => fetchComments(post.id)} className="text-blue-500 hover:text-blue-700 text-sm">
                  Load Comments
                </button>
              </div>

              {token && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment[post.id] || ""}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

              {comments[post.id] && (
                <div className="space-y-2">
                  {comments[post.id].map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-700">{comment.content}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        By: {comment.user?.name} • {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No blog posts found.</p>
        </div>
      )}
    </div>
  )
}

export default Blog
