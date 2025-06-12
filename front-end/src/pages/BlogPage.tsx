"use client"

import type React from "react"

import Blog from "../components/Blog"
import PageLayout from "../components/PageLayout"
import { useTheme } from "../context/ThemeContext"

const BlogPage: React.FC = () => {
  const { isDark } = useTheme()

  // The Blog component now handles its own list/detail view internally.
  // We just need to wrap it in PageLayout if we want the consistent background/scrollbar.
  // For simplicity, I'll pass a dummy section for PageLayout, as Blog component manages its own content.
  // If the Blog component were to expose its internal sections, we'd pass them here.
  // For now, the main content of BlogPage is just the Blog component itself.

  const sections = [
    {
      id: "blog-list",
      title: "Blog Posts",
      content: (
        <div
          className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>All Blog Posts</h2>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Explore my latest articles and insights.
          </p>
          {/* The actual blog list/detail is handled by the Blog component */}
        </div>
      ),
    },
  ]

  return <PageLayout sections={sections}>{<Blog />}</PageLayout>
}

export default BlogPage
