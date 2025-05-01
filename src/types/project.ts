export interface Project {
  id: string
  name: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
  taskCount?: number
}

export interface ProjectCreateDto {
  name: string
  description: string
}

export interface ProjectUpdateDto {
  name?: string
  description?: string
}
