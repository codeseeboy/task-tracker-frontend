import api from "./api"
import type { ProjectCreateDto, ProjectUpdateDto } from "../types/project"

export const projectService = {
  getProjects: async (): Promise<any> => {
    const res = await api.get("/projects")
    // If your API returns data directly in response
    return res 
  },

  getProjectById: async (projectId: string): Promise<any> => {
    const res = await api.get(`/projects/${projectId}`)
    return res 
  },

  createProject: async (projectData: ProjectCreateDto): Promise<any> => {
    const res = await api.post("/projects", projectData)
    return res 
  },

  updateProject: async (projectId: string, projectData: ProjectUpdateDto): Promise<any> => {
    const res = await api.put(`/projects/${projectId}`, projectData)
    return res 
  },

  deleteProject: async (projectId: string): Promise<any> => {
    const res = await api.delete(`/projects/${projectId}`)
    return res 
  },
}