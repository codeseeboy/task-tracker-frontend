export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  projectId: string
  userId: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"

export interface TaskCreateDto {
  title: string
  description: string
  status?: string
  projectId: string
}

export interface TaskUpdateDto {
  title?: string
  description?: string
  status?: string
}
