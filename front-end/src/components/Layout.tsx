"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Moon, Sun } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { token, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <nav className={`shadow-lg transition-colors duration-200 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`text-xl font-bold transition-colors duration-200 ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Portfolio
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  About
                </Link>
                <Link
                  to="/projects"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Projects
                </Link>
                <Link
                  to="/blog"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Blog
                </Link>
                <Link
                  to="/hobbies"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Hobbies
                </Link>
                <Link
                  to="/studies"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Studies
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {token ? (
                <>
                  <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-800"}`}>
                    Welcome, {localStorage.getItem("name") || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  )
}

export default Layout
