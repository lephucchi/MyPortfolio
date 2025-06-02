"use client"

import type React from "react"
import { useTheme } from "../context/ThemeContext"
import PageLayout from "../components/PageLayout"
import AboutMe from "../components/AboutMe"
import { GraduationCap, Award, Database, Server, Cloud } from "lucide-react"

const Home: React.FC = () => {
  const { isDark } = useTheme()

  const ProgramingLanguage = [
    { name: "TypeScript" },
    { name: "Javascript" },
    { name: "Rust" },
    { name: "Python" },
    { name : "R" },
    { name: "html" },
    { name: "CSS" },
  ]
  const FrameworkAndTool = [
    { name: "NestJs" },
    { name: "ExpressJs" },
    { name: "Node.js" },
    { name: "React" },
    { name: "Axum" },
    { name: "Postman" },
    { name: "Docker" },
  ]
  const DatabaseSkill = [
    { name: "PostgreSQL" },
    { name: "MongoDB" },
    { name: "MySQL" },
  ]
  const DevOpsAndCICD = [
    { name: "Git/Github" },
    { name: "Docker" },
  ]

  const education = [
    {
      degree: "Chuyên Toán Tin",
      institution: "THPT Chuyên Nguyễn Du - Đắk Lắk",
      period: "2018 - 2021",
      gpa: "7.5/10",
      description:
        "I'm learning programming and competitive programming for three years. I participated in many programming contests and have a overview of algorithms and data structures. I also have a good understanding of mathematics and logic.",
      courses: [
        "Data Structures",
        "Algorithms and Logic",
        "C++ Programming",
      ],
    },
    {
      degree: "Finance and technology",
      institution: "University of economic and law",
      period: "2021 - 2026",
      gpa: "7.2/10",
      description:
        "I'm learning about technology and finance. I have a good understanding of data analysis, data visualization, data processing, design data pipeline and how to optimize data pipeline. I also have a good understanding of software engineering and web development.",
      courses: [
        "Data Structures & Algorithms",
        "Database Management",
        "Data Analysis",
        "Machine Learning",
        "Deep Learning",
        "Software Engineering",
        "Web Development",
        "Operating Systems",
        "Financial Mathematics",
        "Financial Technology",
      ],
    },
  ]

  const certifications = [
    {
      name: "NVDIA Getting Started with deep Learning",
      issuer: "NVDIA",
      year: "2025",
      color: "bg-white-500",
      description:
        "Foundational knowledge in deep learning concepts and techniques. Covers neural networks, training, and evaluation.",
      skills: ["Neural Networks", "Training", "Evaluation", "TensorFlow", "PyTorch"],
    },
    {
      name: "Data analyst",
      issuer: "Google",
      year: "2025",
      color: "bg-white-500",
      description:
        "Comprehensive training in data analysis, including data cleaning, visualization, and statistical analysis. Proficiency in tools like SQL, Python, and R.",
      skills: ["SQL", "Python", "R", "Data Visualization", "Statistical Analysis"],
    },

  ]

  const sections = [
    {
      id: "skills",
      title: "Skills",
      content: (
        <div
          className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>Technical Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-6 rounded-xl ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                Programming Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {ProgramingLanguage.map((skill) => (
                  <span key={skill.name} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-green-400" : "text-green-600"}`}>
                Frameworks & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {FrameworkAndTool.map((skill) => (
                  <span key={skill.name} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                Databases
              </h3>
              <div className="flex flex-wrap gap-2">
                {DatabaseSkill.map((skill) => (
                  <span key={skill.name} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                DevOps & Infrastructure
              </h3>
              <div className="flex flex-wrap gap-2">
                {DevOpsAndCICD.map((skill) => (
                  <span key={skill.name} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              Additional Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                "REST API Design",
                "GraphQL",
                "CI/CD",
                "Data system Design",
                "Data Modeling",
                "ETL Pipelines",
                "Performance Optimization",
                "Technical Documentation",
                "Data Visualization",
                "Data processing",
                "Data Cleansing",
                "Data Warehousing",
              ].map((skill) => (
                <span
                  key={skill}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    // {
    //   id: "experience",
    //   title: "Experience",
    //   content: (
    //     <div
    //       className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
    //     >
    //       <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>Work Experience</h2>

    //       <div className="space-y-12">
    //         {experiences.map((exp, index) => (
    //           <div key={index} className={`relative ${index !== experiences.length - 1 ? "pb-12" : ""}`}>
    //             {index !== experiences.length - 1 && (
    //               <div className={`absolute left-8 top-16 bottom-0 w-0.5 ${exp.color.replace("border", "bg")}`}></div>
    //             )}

    //             <div className={`p-6 rounded-xl border-l-4 ${exp.color} ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
    //               <div className="flex flex-col md:flex-row md:items-start gap-6">
    //                 <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-md`}>{exp.icon}</div>

    //                 <div className="flex-1">
    //                   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
    //                     <div>
    //                       <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
    //                         {exp.title}
    //                       </h3>
    //                       <p className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}>{exp.company}</p>
    //                     </div>
    //                     <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"} mt-1 md:mt-0`}>
    //                       {exp.period}
    //                     </p>
    //                   </div>

    //                   <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{exp.description}</p>

    //                   <div className="mb-6">
    //                     <h4
    //                       className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
    //                     >
    //                       Technologies Used
    //                     </h4>
    //                     <div className="flex flex-wrap gap-2">
    //                       {exp.technologies.map((tech) => (
    //                         <span
    //                           key={tech}
    //                           className={`px-3 py-1 rounded-full text-sm ${
    //                             isDark
    //                               ? "bg-gray-800 text-gray-300 border border-gray-700"
    //                               : "bg-gray-100 text-gray-700"
    //                           }`}
    //                         >
    //                           {tech}
    //                         </span>
    //                       ))}
    //                     </div>
    //                   </div>

    //                   <div>
    //                     <h4
    //                       className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
    //                     >
    //                       Key Achievements
    //                     </h4>
    //                     <ul className={`list-disc pl-5 space-y-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
    //                       {exp.achievements.map((achievement, i) => (
    //                         <li key={i}>{achievement}</li>
    //                       ))}
    //                     </ul>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   ),
    // },
    {
      id: "education",
      title: "Education",
      content: (
        <div
          className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>Education</h2>

          <div className="space-y-12">
            {education.map((edu, index) => (
              <div key={index} className={`p-6 rounded-xl ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"} shadow-md`}>
                    <GraduationCap className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {edu.degree}
                        </h3>
                        <p className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}>{edu.institution}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {edu.period}
                        </p>
                        <p className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
                          GPA: {edu.gpa}
                        </p>
                      </div>
                    </div>

                    <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{edu.description}</p>

                    <div>
                      <h4
                        className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Key Courses
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.map((course) => (
                          <span
                            key={course}
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "certificates",
      title: "Certificates",
      content: (
        <div
          className={`p-8 rounded-2xl border ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm`}
        >
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
            Professional Certifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border-l-4 ${cert.color} ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${cert.color}`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{cert.name}</h3>
                    <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {cert.issuer} • {cert.year}
                    </p>

                    <p className={`mb-4 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{cert.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-2 py-1 rounded-full text-xs ${
                            isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <PageLayout sections={sections}>
      <AboutMe />
    </PageLayout>
  )
}

export default Home
