"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/ThemeContext"

interface PageLayoutProps {
  children: React.ReactNode
  sections: {
    id: string
    title: string
    content: React.ReactNode
  }[]
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, sections }) => {
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "")
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)
      setScrollProgress(scrollPercent)

      // Find which section is currently in view
      const currentSectionId = Object.entries(sectionRefs.current).find(([id, ref]) => {
        if (!ref) return false
        const rect = ref.getBoundingClientRect()
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2
      })?.[0]

      if (currentSectionId) {
        setActiveSection(currentSectionId)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Calculate scrollbar width based on scroll progress
  const getScrollbarWidth = () => {
    const maxWidth = 60 // percentage
    const minWidth = 0.5 // percentage
    const width = maxWidth - scrollProgress * (maxWidth - minWidth)
    return `${Math.max(width, minWidth)}%`
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} relative overflow-hidden`}>
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
            transition: "background-image 0.3s ease",
          }}
        ></div>
        <div
          className={`absolute inset-0 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? "rgba(75, 85, 99, 0.3)" : "rgba(156, 163, 175, 0.3)"} 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Summary Section */}
        <section className="min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </section>

        {/* Detailed Sections */}
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => { sectionRefs.current[section.id] = el as HTMLDivElement | null }}
            className="min-h-screen p-4 md:p-8 scroll-mt-16"
          >
            <div
              className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
                activeSection === section.id ? "opacity-100 translate-y-0" : "opacity-40 translate-y-8"
              }`}
            >
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {/* Section Navigation */}
      <div
        className={`fixed top-1/2 right-8 transform -translate-y-1/2 z-30 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? isDark
                    ? "bg-blue-400 w-4 h-4"
                    : "bg-blue-500 w-4 h-4"
                  : isDark
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Scroll to ${section.title}`}
            />
          ))}
        </div>
      </div>

      {/* Custom Horizontal Scrollbar */}
      <div className="fixed bottom-6 left-0 w-full z-30 flex justify-center items-center pointer-events-none">
        <div
          ref={scrollbarRef}
          className={`h-1 rounded-full transition-all duration-300 ${isDark ? "bg-blue-500" : "bg-blue-600"}`}
          style={{
            width: getScrollbarWidth(),
            opacity: scrollProgress > 0.98 ? 0.2 : 1,
            transform: scrollProgress > 0.98 ? "scale(0.5)" : "scale(1)",
          }}
        ></div>
      </div>
    </div>
  )
}

export default PageLayout
