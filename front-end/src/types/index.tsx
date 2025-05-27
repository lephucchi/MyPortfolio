export interface User {
  id: number
  name: string
  email: string
  password?: string
  isVerified: boolean
  createdAt: string
}

export interface Project {
  id: number
  title: string
  description: string
  technologies?: string
  githubLink?: string
  documentation?: string
  thumbnailUrl?: string
  user: User
  createdAt: string
}

export interface BlogPost {
  id: number
  title: string
  content: string
  author: User
  comments: Comment[]
  createdAt: string
}

export interface Comment {
  id: number
  content: string
  user: User
  post: BlogPost
  createdAt: string
}

export interface Hobby {
  id: number
  name: string
  description: string
  user: User
  createdAt: string
}

export interface Study {
  id: number
  title: string
  content: string
  author: User
  createdAt: string
}
