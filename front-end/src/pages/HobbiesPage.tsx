"use client"

import type React from "react"

import Hobbies from "../components/Hobbies"
import PageLayout from "../components/PageLayout"
import { useTheme } from "../context/ThemeContext"

const HobbiesPage: React.FC = () => {
  const { isDark } = useTheme()

  const sections = [
    {
      id: "hobbies-list",
      title: "My Hobbies",
      content: (
        <div
          className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>My Hobbies</h2>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            A glimpse into what I enjoy outside of work.
          </p>
        </div>
      ),
    },
  ]

  return <PageLayout sections={sections}>{<Hobbies />}</PageLayout>
}

export default HobbiesPage
