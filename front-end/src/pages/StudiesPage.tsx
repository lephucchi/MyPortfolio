"use client"

import type React from "react"

import Studies from "../components/Studies"
import PageLayout from "../components/PageLayout"
import { useTheme } from "../context/ThemeContext"

const StudiesPage: React.FC = () => {
  const { isDark } = useTheme()

  const sections = [
    {
      id: "studies-timeline",
      title: "Learning Journey",
      content: (
        <div
          className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>My Learning Journey</h2>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            A chronological overview of my educational and self-learning path.
          </p>
        </div>
      ),
    },
  ]

  return <PageLayout sections={sections}>{<Studies />}</PageLayout>
}

export default StudiesPage
