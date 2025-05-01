import api from "./api"
import type { TaskCreateDto, TaskUpdateDto } from "../types/task"

export const taskService = {
  // Update the getTasks method to properly handle the projectId parameter
  getTasks: async (projectId?: string): Promise<any> => {
    // Only add the projectId parameter if it exists
    const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks"
    console.log("Fetching tasks with URL:", url)
    return api.get(url)
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
