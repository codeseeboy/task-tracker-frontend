import { useQuery, useMutation, useQueryClient } from "react-query"
import { toast } from "react-toastify"
import { taskService } from "../services/taskService"
import type { TaskCreateDto, TaskUpdateDto, TaskQueryParams, PaginatedTasksResponse } from "../types/task"

export const useTasks = (params: TaskQueryParams = {}) => {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    error,
  } = useQuery(
    ["tasks", params],
    () => taskService.getTasks(params),
    {
      onError: (err) => {
        console.error("Failed to fetch tasks:", err)
        toast.error("Failed to fetch tasks")
      },
      keepPreviousData: true,
    },
  )

  // The API now returns { tasks, pagination } from the response interceptor
  const tasksResponse = data as PaginatedTasksResponse | undefined
  const tasks = tasksResponse?.tasks || []
  const pagination = tasksResponse?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

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
    pagination,
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
