import { useQuery, useMutation, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import { taskService } from "../services/taskService"
import type { TaskCreateDto, TaskUpdateDto } from "../types/task"

export const useTasks = (projectId?: string) => {
  const queryClient = useQueryClient()
  console.log("useTasks hook called with projectId:", projectId)

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery(["tasks", projectId], () => taskService.getTasks(projectId), {
    onError: (err) => {
      console.error("Failed to fetch tasks:", err)
      toast.error("Failed to fetch tasks")
    },
    // Only run the query if projectId is defined when it's required
    enabled: projectId ? true : true,
  })

  const createTaskMutation = useMutation((newTask: TaskCreateDto) => taskService.createTask(newTask), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"])
      toast.success("Task created successfully")
    },
    onError: () => {
      toast.error("Failed to create task")
    },
  })

  const updateTaskMutation = useMutation(
    ({ taskId, data }: { taskId: string; data: TaskUpdateDto }) => taskService.updateTask(taskId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"])
        toast.success("Task updated successfully")
      },
      onError: () => {
        toast.error("Failed to update task")
      },
    },
  )

  const deleteTaskMutation = useMutation((taskId: string) => taskService.deleteTask(taskId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"])
      toast.success("Task deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete task")
    },
  })

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
  }
}

export const useTask = (taskId: string) => {
  const {
    data: task,
    isLoading,
    error,
  } = useQuery(["task", taskId], () => taskService.getTaskById(taskId), {
    enabled: !!taskId,
    onError: () => {
      toast.error("Failed to fetch task details")
    },
  })

  return {
    task,
    isLoading,
    error,
  }
}
