import { useQuery, useMutation, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import { projectService } from "../services/projectService"
import type { ProjectCreateDto, ProjectUpdateDto } from "../types/project"

export const useProjects = () => {
  const queryClient = useQueryClient()

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery(["projects"], () => projectService.getProjects(), {
    onError: () => {
      toast.error("Failed to fetch projects")
    },
  })

  const createProjectMutation = useMutation(
    (newProject: ProjectCreateDto) => projectService.createProject(newProject),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"])
        toast.success("Project created successfully")
      },
      onError: () => {
        toast.error("Failed to create project")
      },
    },
  )

  const updateProjectMutation = useMutation(
    ({ projectId, data }: { projectId: string; data: ProjectUpdateDto }) =>
      projectService.updateProject(projectId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"])
        toast.success("Project updated successfully")
      },
      onError: () => {
        toast.error("Failed to update project")
      },
    },
  )

  const deleteProjectMutation = useMutation((projectId: string) => projectService.deleteProject(projectId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"])
      toast.success("Project deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete project")
    },
  })

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isLoading,
    isUpdating: updateProjectMutation.isLoading,
    isDeleting: deleteProjectMutation.isLoading,
  }
}

export const useProject = (projectId: string) => {
  console.log("Fetching project with ID:", projectId)

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["project", projectId], () => projectService.getProjectById(projectId), {
    enabled: !!projectId,
    onError: (err) => {
      console.log("Project fetch error:", err)
      toast.error("Failed to fetch project details")
    },
  })

  return {
    project,
    isLoading,
    error,
  }
}
