"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import EmptyState from "../../components/ui/EmptyState"
import TaskCard from "../../components/tasks/TaskCard"
import TaskForm from "../../components/tasks/TaskForm"
import Modal from "../../components/ui/Modal"
import Confirmation from "../../components/ui/Confirmation"
import { useTasks } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import type { Task, TaskStatus, TaskUpdateDto } from "../../types/task"

const Tasks: React.FC = () => {
  const {
    tasks,
    isLoading: isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks()

  const { projects, isLoading: isLoadingProjects } = useProjects()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL")

  const isLoading = isLoadingTasks || isLoadingProjects

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  const selectedTask = selectedTaskId ? tasks.find((task: { id: string }) => task.id === selectedTaskId) : null

  const filteredTasks = filter === "ALL" ? tasks : tasks.filter((task: { status: string }) => task.status === filter)

  const handleCreateTask = (data: any) => {
    createTask(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }

  const handleUpdateTask = (data: TaskUpdateDto) => {
    if (selectedTaskId) {
      updateTask(
        { taskId: selectedTaskId, data },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
            setSelectedTaskId(null)
          },
        },
      )
    }
  }

  const handleDeleteTask = () => {
    if (selectedTaskId) {
      deleteTask(selectedTaskId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setSelectedTaskId(null)
        },
      })
    }
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask({ taskId, data: { status } })
  }

  const openEditModal = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                filter === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("TODO")}
              className={`px-4 py-2 text-sm font-medium ${
                filter === "TODO"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setFilter("IN_PROGRESS")}
              className={`px-4 py-2 text-sm font-medium ${
                filter === "IN_PROGRESS"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("REVIEW")}
              className={`px-4 py-2 text-sm font-medium ${
                filter === "REVIEW"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setFilter("DONE")}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                filter === "DONE"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Done
            </button>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Task
          </Button>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task: Task, index: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TaskCard
                task={task}
                onEdit={() => openEditModal(task.id)}
                onDelete={() => openDeleteModal(task.id)}
                onStatusChange={(status) => handleStatusChange(task.id, status)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={filter === "ALL" ? "No tasks found" : `No ${filter.toLowerCase().replace("_", " ")} tasks`}
          description={
            filter === "ALL" ? "Create your first task to get started" : "Change the filter or create a new task"
          }
          actionLabel="Create Task"
          onAction={() => setIsCreateModalOpen(true)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          }
        />
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreateTask} projects={projects} isLoading={isCreating} />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        {selectedTask && (
          <TaskForm onSubmit={handleUpdateTask} task={selectedTask} projects={projects} isLoading={isUpdating} />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

export default Tasks
