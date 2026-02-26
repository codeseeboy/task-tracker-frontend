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

export interface TaskQueryParams {
  projectId?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedTasksResponse {
  tasks: Task[]
  pagination: PaginationInfo
}
