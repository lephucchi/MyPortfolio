"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { ThumbsUp, Heart, Laugh, Annoyed, Frown, Angry } from "lucide-react"
import type { Reaction } from "../types"

interface ReactionsProps {
  entityType: "project" | "blogPost" | "comment" | "hobby" | "study"
  entityId: number
  initialReactions?: Reaction[]
  onReactionChange?: (reactions: Reaction[]) => void
}

const reactionIcons = {
  like: ThumbsUp,
  love: Heart,
  haha: Laugh,
  wow: Annoyed, // Using Annoyed for Wow, as there's no direct 'wow' icon
  sad: Frown,
  angry: Angry,
}

const Reactions: React.FC<ReactionsProps> = ({ entityType, entityId, initialReactions = [], onReactionChange }) => {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const { token } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    setReactions(initialReactions)
    if (token) {
      const storedUser = JSON.parse(atob(token.split(".")[1])) // Decode JWT to get user ID
      const foundReaction = initialReactions.find((r) => r.userId === storedUser.id)
      setUserReaction(foundReaction ? foundReaction.type : null)
    } else {
      setUserReaction(null)
    }
  }, [initialReactions, token])

  const fetchReactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/reactions`, {
        params: { entityType, entityId },
      })
      setReactions(response.data)
      if (onReactionChange) {
        onReactionChange(response.data)
      }
      if (token) {
        const storedUser = JSON.parse(atob(token.split(".")[1]))
        const foundReaction = response.data.find((r: Reaction) => r.userId === storedUser.id)
        setUserReaction(foundReaction ? foundReaction.type : null)
      }
    } catch (err) {
      console.error("Failed to fetch reactions:", err)
    }
  }

  const handleReaction = async (type: string) => {
    if (!token) {
      alert("Please login to react.")
      return
    }

    try {
      if (userReaction === type) {
        // User is un-reacting
        await axios.delete(`http://localhost:5000/reactions`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { entityType, entityId }, // Send entityType and entityId in body for DELETE
        })
        setUserReaction(null)
      } else {
        // User is reacting or changing reaction
        await axios.post(
          `http://localhost:5000/reactions`,
          { type, entityType, entityId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        setUserReaction(type)
      }
      fetchReactions() // Re-fetch reactions to update counts and user's reaction state
    } catch (err: any) {
      console.error("Failed to update reaction:", err.response?.data?.message || err.message)
      alert("Failed to update reaction: " + (err.response?.data?.message || "Unknown error"))
    }
  }

  const getReactionCount = (type: string) => {
    return reactions.filter((r) => r.type === type).length
  }

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} border ${
        isDark ? "border-gray-600" : "border-gray-200"
      }`}
    >
      {Object.entries(reactionIcons).map(([type, Icon]) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors duration-200 ${
            userReaction === type
              ? isDark
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white"
              : isDark
                ? "text-gray-300 hover:bg-gray-600"
                : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Icon size={16} />
          <span className="font-medium">{getReactionCount(type)}</span>
        </button>
      ))}
    </div>
  )
}

export default Reactions
