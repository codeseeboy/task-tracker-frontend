import api from "./api"
import type { TaskCreateDto, TaskUpdateDto, TaskQueryParams } from "../types/task"

export const taskService = {
  /**
   * Get tasks with optional pagination, filtering by status, and search by title.
   */
  getTasks: async (params: TaskQueryParams = {}): Promise<any> => {
    const queryParts: string[] = []

    if (params.projectId) queryParts.push(`projectId=${params.projectId}`)
    if (params.status) queryParts.push(`status=${params.status}`)
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`)
    if (params.page) queryParts.push(`page=${params.page}`)
    if (params.limit) queryParts.push(`limit=${params.limit}`)

    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : ""
    return api.get(`/tasks${queryString}`)
  },

  getTaskById: async (taskId: string) => {
    return api.get(`/tasks/${taskId}`)
  },

  createTask: async (taskData: TaskCreateDto) => {
    return api.post("/tasks", taskData)
  },

  updateTask: async (taskId: string, taskData: TaskUpdateDto) => {
    return api.put(`/tasks/${taskId}`, taskData)
  },

  deleteTask: async (taskId: string) => {
    return api.delete(`/tasks/${taskId}`)
  },
}
