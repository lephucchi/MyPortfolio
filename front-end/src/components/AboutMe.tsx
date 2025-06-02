"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "../context/ThemeContext"
import { Github, Linkedin, Mail, MapPin, Calendar, Download, ExternalLink, Database, Server, Cloud } from "lucide-react"

const AboutMe: React.FC = () => {
  const { isDark } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const skills = [
    { name: "Back-end" },
    { name: "Data Engineer" },
    { name: "DevOps" },
    { name: "Programing" },
  ]

  const experiences = [
    {
      title: "Data Engineer",
      company: "Not yet",
      period: "Not yet",
      color: "border-blue-500",
      icon: <Server className="w-5 h-5" />,
    },
    {
      title: "Music Organization Leader",
      company: "404 Art group",
      period: "2023 - 2024",
      color: "border-green-500",
      icon: <Database className="w-5 h-5" />,
    },
    {
      title: "Backend Developer",
      company: "Not yet",
      period: "Not yet",
      color: "border-purple-500",
      icon: <Cloud className="w-5 h-5" />,
    },
  ]

  const certifications = [
    { name: "NVDIA Deeplearning", issuer: "NVDIA", year: "2024", color: "bg-orange-500" },
    { name: "Data analyst", issuer: "Corsera", year: "2023", color: "bg-blue-500" },
  ]

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? "bg-gray-900" : "bg-gray-50"} relative overflow-hidden`}>
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Lê Phúc Chí 
          </h1>
          <p className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>Data Engineer & Backend Developer</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
          {/* Profile Card - Large */}
          <div
            className={`lg:col-span-2 lg:row-span-2 p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  {/* Sửa đường dẫn ảnh - đặt ảnh trong thư mục public */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ28rk3XxYQvDjSIXGw8BAFyqMbiBzxlTjUng&s" // Đường dẫn tương đối từ thư mục public
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>About Me</h2>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed mb-4`}>
                  Passionate Data Engineer with 3+ years of experience building scalable data pipelines and robust
                  backend systems. I love turning complex data into actionable insights.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">Data Engineering</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">Backend Developer</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm">
                    Fintech Developer
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>phucchi12112004@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Ho Chi Minh city, Viet Nam</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Third year student of Fintech</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
            <a 
              href="https://github.com/lephucchi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https/www.linkedin.com/in/lê-phúc-chí-dataengineer-backend-developer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
          </div>

          {/* Quick Stats */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Education</span>
                <span className="text-blue-500 font-semibold">Third year student</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Projects</span>
                <span className="text-green-500 font-semibold">10+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Certifications</span>
                <span className="text-purple-500 font-semibold">4</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div
            className={`lg:col-span-2 p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <span key={skill.name} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}>{skill.name}</span>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div
            className={`lg:col-span-2 p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Work Experience</h3>
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <div key={index} className={`border-l-2 ${exp.color} pl-4 pb-4 last:pb-0`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>{exp.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{exp.title}</h4>
                      <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{exp.company}</p>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{exp.period}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Education</h3>
            <div className="space-y-3">
              <div>
                <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Chuyên Toán Tin</h4>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}> THPT Chuyên Nguyễn Du - Đắk Lắk</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>2018 - 2021</p>
              </div>
              <div>
                <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Finance and technology</h4>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>University of economic and law</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>2022-2026</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Certifications</h3>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cert.color}`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{cert.name}</p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Resume */}
          <div
            className={`lg:col-span-2 p-6 rounded-2xl border border-blue-500/50 ${
              isDark ? "bg-blue-500/10" : "bg-blue-50"
            } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Ready to work together?
                </h3>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Download my resume or get in touch to discuss opportunities.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  Resume
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutMe
