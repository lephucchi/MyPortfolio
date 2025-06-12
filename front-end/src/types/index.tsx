export interface User {
  id: number
  name: string
  email: string
  password?: string
  isVerified: boolean
  createdAt: string
}

export interface Reaction {
  id: number
  type: "like" | "love" | "haha" | "wow" | "sad" | "angry"
  userId: number
  entityType: "project" | "blogPost" | "comment" | "hobby" | "study"
  entityId: number
  user?: User // Optional, if we want to show who reacted
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
  reactions?: Reaction[] // Added reactions
  createdAt: string
}

export interface BlogPost {
  id: number
  title: string
  content: string
  author: User
  comments: Comment[]
  reactions?: Reaction[] // Added reactions
  createdAt: string
}

export interface Comment {
  id: number
  content: string
  user: User
  post: BlogPost
  reactions?: Reaction[] // Added reactions
  createdAt: string
}

export interface Hobby {
  id: number
  name: string
  description: string
  user: User
  reactions?: Reaction[] // Added reactions
  createdAt: string
}

export interface Study {
  id: number
  title: string
  content: string
  author: User
  reactions?: Reaction[] // Added reactions
  createdAt: string
}
